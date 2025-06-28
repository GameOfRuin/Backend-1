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
import { LoginUserDto, PasswordChangeDto, RegisterUserDto } from './dto';

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

    const tokens = this.jwtService.makeTokenPair(user);
    const { id } = user;

    await this.redis.set(
      redisRefreshTokenKey(tokens.refreshSecret),
      { id },
      { EX: 64000 },
    );

    return tokens;
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
    if (id) {
      const user = await UserEntity.findOne({
        where: { id: id },
      });
      if (!user) {
        throw new NotFoundException('Исполнитель не найден');
      }
    }
  }
}
