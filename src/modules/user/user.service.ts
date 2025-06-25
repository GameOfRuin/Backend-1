import { injectable } from 'inversify';
import { UserEntity } from '../../database/entities/user.entity';
import { ConflictException, UnauthorizedException } from '../../exceptions';
import logger from '../../logger';
import { LoginUserDto, RegisterUserDto } from './dto';

@injectable()
export class UserService {
  async register(dto: RegisterUserDto) {
    logger.info(`Регистрация нового пользователя email = ${dto.email}`);

    const exist = await UserEntity.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new ConflictException('Такой email уже существует');
    }

    const newUser = await UserEntity.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const user = {
      email: newUser.email,
      name: newUser.name,
    };

    return user;
  }
  async login(dto: LoginUserDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    const login = await UserEntity.findOne({
      where: { email: dto.email, password: dto.password },
    });
    if (!login) {
      throw new UnauthorizedException('Не найден email или неправильный пароль');
    }

    return { email: dto.email };
  }
}
