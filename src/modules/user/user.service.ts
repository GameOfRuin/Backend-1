import { compare, hash } from 'bcrypt';
import { injectable } from 'inversify';
import { UserEntity } from '../../database/entities/user.entity';
import { ConflictException, UnauthorizedException } from '../../exceptions';
import logger from '../../logger';
import { LoginUserDto, PasswordChangeDto, RegisterUserDto } from './dto';

@injectable()
export class UserService {
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

    return { email: dto.email };
  }
  async passwordChange(dto: PasswordChangeDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    await this.login(dto);

    dto.password = await hash(dto.newPassword, 10);

    await UserEntity.update(dto, { where: { email: dto.email } });

    return { message: 'Смена пароля' };
  }
}
