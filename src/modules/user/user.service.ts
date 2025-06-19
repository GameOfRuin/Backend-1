import { injectable } from 'inversify';
import logger from '../../logger';
import { RegisterUserDto } from './dto';

@injectable()
export class UserService {
  register(dto: RegisterUserDto) {
    logger.info(`Регистрация нового пользователя email = ${dto.email}`);

    return { id: 1 };
  }
  login(dto: RegisterUserDto) {
    logger.info(`Пришли данные для логина. email = ${dto.email}`);

    return { id: 2 };
  }
}
