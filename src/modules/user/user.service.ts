import axios from 'axios';
import { compare, hash } from 'bcrypt';
import { CronJob } from 'cron';
import { inject, injectable } from 'inversify';
import { redisRefreshTokenKey, redisUserToken } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { LoginInfoEntity, UserEntity } from '../../database';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../../exceptions';
import logger from '../../logger';
import { NEW_REGISTRATION_QUEUE } from '../../message-broker/rabbitmq.queues';
import { RabbitMqService } from '../../message-broker/rabbitmq.service';
import { TimeInSeconds } from '../../shared';
import { JwtService } from '../jwt/jwt.service';
import { TelegramService } from '../telegram/telegram.service';
import { LoginUserDto, PasswordChangeDto, RefreshTokenDto, RegisterUserDto } from './dto';
import { NewRegistrationMessage } from './user.types';
import { LoginAttempt } from './user-login.types';

@injectable()
export class UserService {
  private readonly jobTmpDomains = new CronJob(
    '* * * * *',
    this.loadTmpDomains,
    null,
    true,
    'Europe/Moscow',
  );

  private readonly jobLoginInfo = new CronJob(
    '*/30 * * * * *',
    () => this.loginInfoToDatabase(),
    null,
    true,
    'Europe/Moscow',
  );

  private tmpDomains: string[] = [];
  private loginInfo: LoginAttempt[] = [];

  constructor(
    @inject(RedisService)
    private readonly redis: RedisService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
    @inject(RabbitMqService)
    private readonly rabbitMqService: RabbitMqService,
    @inject(TelegramService)
    private readonly telegramService: TelegramService,
  ) {
    this.loadTmpDomains();
  }

  async loginInfoToDatabase() {
    if (!this.loginInfo.length) {
      logger.info('Нечего сохранять');
      return;
    }

    await LoginInfoEntity.bulkCreate(this.loginInfo);

    logger.info(`Сохранено ${this.loginInfo.length} новых логинов`);

    this.loginInfo = [];
  }

  async loadTmpDomains() {
    const { data: tmpDomains } = await axios.get(
      'https://raw.githubusercontent.com/disposable/disposable-email-domains/refs/heads/master/domains.txt',
    );

    // const tmpDomainsSplit: string[] = tmpDomains
    //   .split('\n')
    //   .reduce((acc: [], curr: string) => {
    //     this.redis.delete(redisTmpDomain(curr));
    //   }, []);

    this.tmpDomains = tmpDomains.split('\n');

    logger.info(`Получено ${this.tmpDomains.length} доменов`);
  }

  async register(dto: RegisterUserDto) {
    logger.info(`Регистрация нового пользователя email = ${dto.email}`);

    const emailDomain = dto.email.split('@')[1];

    if (this.tmpDomains.includes(emailDomain)) {
      throw new BadRequestException('Регистрация на временную почту запрещена');
    }

    const exist = await UserEntity.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new ConflictException('Такой email уже существует');
    }

    dto.password = await hash(dto.password, 10);

    const newUser = await UserEntity.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const message: NewRegistrationMessage = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    await this.rabbitMqService.channel.sendToQueue(NEW_REGISTRATION_QUEUE, message);

    const { password, ...user } = newUser.toJSON();

    return user;
  }

  async login(dto: LoginUserDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    let newLogin: LoginAttempt = {
      time: new Date().toString(),
      ip: '1',
      email: dto.email,
      success: true,
    };

    const user = await UserEntity.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      newLogin = { ...newLogin, success: false, failReason: 'Такого пользователя нет' };

      this.loginInfo.push(newLogin);

      throw new UnauthorizedException('Такого пользователя нет');
    }
    if (!(await compare(dto.password, user.password))) {
      newLogin = { ...newLogin, success: false, failReason: 'Неверный пароль' };

      this.loginInfo.push(newLogin);

      throw new UnauthorizedException('Неверный пароль');
    }
    if (!user.isActive) {
      newLogin = { ...newLogin, success: false, failReason: 'Пользователь заблокирован' };

      this.loginInfo.push(newLogin);

      throw new UnauthorizedException('Пользователь заблокирован');
    }

    this.loginInfo.push(newLogin);
    logger.info(`${this.loginInfo.length}`);

    return await this.getTokenPair(user);
  }

  async logout(refreshToken: RefreshTokenDto['refreshToken'], userId: UserEntity['id']) {
    logger.info('Пришел запрос на logout');

    const data = await this.redis.get(redisRefreshTokenKey(refreshToken));
    if (!data) {
      throw new UnauthorizedException();
    }

    const { id } = data;

    if (userId !== id) {
      throw new UnauthorizedException();
    }

    await this.redis.delete(redisRefreshTokenKey(refreshToken));

    return { message: 'Произошел выход' };
  }

  async refresh(token: RefreshTokenDto['refreshToken'], user: UserEntity) {
    logger.info('Пришел запрос на обновление RefreshToken');

    const data = await this.redis.get(redisRefreshTokenKey(token));
    if (!data) {
      throw new UnauthorizedException();
    }

    const { id } = data;
    if (user.id !== id) {
      throw new UnauthorizedException();
    }

    await this.redis.delete(redisRefreshTokenKey(token));

    return await this.getTokenPair(user);
  }

  async passwordChange(dto: PasswordChangeDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    await this.login(dto);

    dto.password = await hash(dto.newPassword, 10);

    await UserEntity.update(dto, { where: { email: dto.email } });

    return { message: 'Смена пароля' };
  }

  async profile(id: UserEntity['id'] | undefined) {
    logger.info(`Чтение профиля userId=${id}`);

    const user = await UserEntity.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async changeIsActive(id: UserEntity['id'], isActive: boolean) {
    logger.info(`Пришл запрос на ${isActive ? 'раз' : ''}блокировку пользователя ${id}`);

    await this.profile(id);

    await UserEntity.update({ isActive }, { where: { id } });

    return { message: `Пользователь ${id} ${isActive ? 'раз' : 'за'}блокирован` };
  }

  async getTokenPair(user: UserEntity) {
    const tokens = this.jwtService.makeTokenPair(user);
    const { id } = user;

    await this.redis.set(
      redisRefreshTokenKey(tokens.refreshSecret),
      { id },
      { EX: TimeInSeconds.day },
    );
    return tokens;
  }

  async telegramLink(id: UserEntity['id']) {
    logger.info('Пришел запрос получение теллеграм ссылки');

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.set(redisUserToken(token), { id }, { EX: 5 * TimeInSeconds.minute });

    return `https://t.me/Backend11bot_bot?start=${token}`;
  }

  async getAllAdminsTelegramId() {
    return await UserEntity.findAll({ where: { role: 'admin' } });
  }
}
