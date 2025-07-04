import { compare, hash } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { redisRefreshTokenKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { UserEntity } from '../../database';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../../exceptions';
import logger from '../../logger';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserDto, PasswordChangeDto, RefreshTokenDto, RegisterUserDto } from './dto';

@injectable()
export class UserService {
  constructor(
    @inject(RedisService)
    private readonly redis: RedisService,
    @inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    logger.info(`Регистрация нового пользователя email = ${dto.email}`);

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
    const { password, ...user } = newUser.toJSON();

    return user;
  }

  async login(dto: LoginUserDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    const user = await UserEntity.findOne({
      where: { email: dto.email },
    });
    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException('Не найден email или неправильный пароль');
    }

    return await this.getTokenPair(user);
  }

  async logout(refreshToken: RefreshTokenDto['refreshToken']) {
    logger.info('Пришел запрос на logout');

    const idUser = this.redis.get(redisRefreshTokenKey(refreshToken));
    if (!idUser) {
      throw new UnauthorizedException();
    }

    await this.redis.delete(redisRefreshTokenKey(refreshToken));

    return { message: 'Произошел выход' };
  }

  async refresh(token: RefreshTokenDto['refreshToken'], user: UserEntity) {
    logger.info('Пришел запрос на обновление RefreshToken');

    await this.logout(token);

    return await this.getTokenPair(user);
  }

  async passwordChange(dto: PasswordChangeDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    await this.login(dto);

    dto.password = await hash(dto.newPassword, 10);

    await UserEntity.update(dto, { where: { email: dto.email } });

    return { message: 'Смена пароля' };
  }

  async profile(id: UserEntity['id']) {
    logger.info(`Чтение профиля userId=${id}`);

    const user = await UserEntity.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new Error('Not Found');
    }

    return user;
  }

  async findUser(id: UserEntity['id'] | undefined) {
    const user = await UserEntity.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Исполнитель не найден');
    }

    return user;
  }

  async block(id: UserEntity['id'], unBlock?: boolean) {
    logger.info(`Блокировка пользователя по id=${id}`);

    const value = unBlock ?? false;

    await this.findUser(id);

    await UserEntity.update({ isActive: value }, { where: { id } });

    return { message: `Пользователь ${id}  заблокирован` };
  }
  async unBlock(id: UserEntity['id']) {
    logger.info(`Разблокировка пользователя по id=${id}`);

    await this.block(id, true);

    return { message: 'Пользователь разблокирован' };
  }

  async getTokenPair(user: UserEntity) {
    const tokens = this.jwtService.makeTokenPair(user);
    const { id } = user;

    await this.redis.set(
      redisRefreshTokenKey(tokens.refreshSecret),
      { id },
      { EX: 64000 },
    );
    return tokens;
  }
}
