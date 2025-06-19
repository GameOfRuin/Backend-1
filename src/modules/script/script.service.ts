import { injectable } from 'inversify';
import logger from '../../logger';
import { PaginationDto } from './dto';

@injectable()
export class ScriptService {
  fetchScript(dto: PaginationDto) {
    logger.info(`Пришел запрос на чтение скриптов`);

    return { limit: `${dto.limit}` };
  }

  fetchComplexScript(dto: PaginationDto) {
    logger.info(`Пришел запрос на чтение сложных скриптов`);

    return { limit: `${dto.limit}` };
  }

  getScriptById(id: number) {
    logger.info(`Чтение скрипта по номеру=${id}`);

    return { message: `Вы пытаетесь получить скрипт номеру=${id}` };
  }
  getComplexScriptById(id: number) {
    logger.info(`Чтение сложного скрипта по номеру=${id}`);

    return { message: `Вы пытаетесь получить сложный скрипт по номеру=${id}` };
  }
}
