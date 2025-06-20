import { injectable } from 'inversify';
import { UserEntity } from '../../database/entities/user.entity';
import { BadRequestException } from '../../exceptions';
import { NotFoundExceptione } from '../../exceptions/not-found.exception';
import logger from '../../logger';
import { RegisterUserDto } from './dto';

@injectable()
export class UserService {
  async register(dto: RegisterUserDto) {
    logger.info(`Регистрация нового пользователя email = ${dto.email}`);

    const exist = await UserEntity.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const user = await UserEntity.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    return { user };
  }
  async login(dto: RegisterUserDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    const login = await UserEntity.findOne({
      where: { email: dto.email, password: dto.password },
    });
    if (!login) {
      throw new NotFoundExceptione('Не найден email или пароль');
    }

    return { login };
  }
}
