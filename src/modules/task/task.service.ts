import { inject, injectable } from 'inversify';
import { redisTaskKey, redisTasksKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { TaskEntity } from '../../database/entities/task.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { ConflictException, NotFoundException } from '../../exceptions';
import logger from '../../logger';
import { PaginationDto } from '../../shared';
import { CreateTaskDto } from './dto';

@injectable()
export class TaskService {
  constructor(
    @inject(RedisService)
    private readonly redis: RedisService,
  ) {}

  async getTasks(dto: PaginationDto) {
    logger.info(`Запрос на чтение списка задач`);

    const { limit, offset } = dto;

    const cacheTasks = await this.redis.get<TaskEntity>(redisTasksKey(limit, offset));

    if (cacheTasks) {
      return cacheTasks;
    }

    const tasks = await TaskEntity.findAll({
      limit,
      offset,
      attributes: ['title', 'status', 'importance', 'description'],
      include: [{ model: UserEntity, attributes: ['id', 'name'] }],
    });
    if (!tasks) {
      throw new NotFoundException('Задач не найдено');
    }

    await this.redis.set(redisTasksKey(limit, offset), tasks, { EX: 300 });

    return tasks;
  }

  async getTaskById(idTask: TaskEntity['id']) {
    logger.info(`Чтение задачи по id=${idTask}`);

    const cacheTask = await this.redis.get<TaskEntity>(redisTaskKey(idTask));

    if (cacheTask) {
      return cacheTask;
    }

    const findById = await TaskEntity.findOne({
      where: { id: idTask },
      attributes: ['title', 'status', 'importance', 'description'],
      include: [{ model: UserEntity, attributes: ['id', 'name'] }],
    });

    if (!findById) {
      throw new NotFoundException('Такой задачи не найдено');
    }

    await this.redis.set(redisTaskKey(idTask), findById, { EX: 300 });

    return { findById };
  }

  async createTask(dto: CreateTaskDto) {
    logger.info(`Создание задачи`);

    const task = await TaskEntity.findOne({
      where: { title: dto.title },
    });
    const user = await UserEntity.findOne({
      where: { id: dto.assigneeId },
    });
    if (task) {
      throw new ConflictException('Такая задача уже есть');
    }
    if (!user) {
      throw new NotFoundException('Исполнитель не найден');
    }

    const newTask = await TaskEntity.create({
      title: dto.title,
      status: dto.status,
      description: dto.description,
      importance: dto.importance,
      assigneeId: dto.assigneeId,
    });

    return { message: `Вы создали задачу ${dto.title}` };
  }

  async updateTask(dto: CreateTaskDto, idTask: TaskEntity['id']) {
    logger.info(`Изменение задачи по id=${dto.title}`);

    await this.getTaskById(idTask);

    const updated = await TaskEntity.update(dto, { where: { id: idTask } });

    return { message: `Обновлена задача ${idTask}` };
  }

  async deleteOne(id: TaskEntity['id']) {
    logger.info(`Удаление задачи id=${id}`);

    await this.getTaskById(id);

    const deleted = await TaskEntity.destroy({ where: { id } });

    return { success: Boolean(deleted) };
  }
}
