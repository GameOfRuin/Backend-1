import { injectable } from 'inversify';
import logger from '../../logger';
import { PaginationDto } from '../../shared';
import { CreateTaskDto } from './dto';

@injectable()
export class TaskService {
  getTasks(dto: PaginationDto) {
    logger.info(`Чтение списка задач`);

    return { limit: `${dto.limit}` };
  }

  getTaskById(id: number) {
    logger.info(`Чтение задачи по id=${id}`);

    return { message: `Вы пытаетесь прочитать задачу id=${id}` };
  }
  createTask(dto: CreateTaskDto) {
    logger.info(`Создание задачи`);

    return { message: `Вы создали задачу ${dto.title}` };
  }
}
