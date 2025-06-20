import { injectable } from 'inversify';
import logger from '../../logger';
import { PaginationDto } from '../../shared';
import { CreateTaskDto } from './dto';
import { TaskEntity } from '../../database/entities/task.entity';
import { ConflictException } from '../../exceptions';

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
  async createTask(dto: CreateTaskDto) {
    logger.info(`Создание задачи`);

    const task = await TaskEntity.findOne({
      where: { title: dto.title },
    });
    if (task) {
      throw new ConflictException('Такая задача уже есть');
    }

    const newTask = await TaskEntity.create({
      title: dto.title,
      status: dto.status,
      description: dto.description,
      importance: dto.importance,
    });

    return { message: `Вы создали задачу ${dto.title}` };
  }
}
