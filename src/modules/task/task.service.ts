import { injectable } from 'inversify';
import { TaskEntity } from '../../database/entities/task.entity';
import { ConflictException, NotFoundException } from '../../exceptions';
import logger from '../../logger';
import { PaginationDto } from '../../shared';
import { CreateTaskDto } from './dto';

@injectable()
export class TaskService {
  getTasks(dto: PaginationDto) {
    logger.info(`Чтение списка задач`);

    return { limit: `${dto.limit}` };
  }

  async getTaskById(idTask: number) {
    logger.info(`Чтение задачи по id=${idTask}`);

    const findById = await TaskEntity.findOne({ where: { id: idTask } });

    if (!findById) {
      throw new NotFoundException('Такой задачи не найдено');
    }

    return findById;
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
