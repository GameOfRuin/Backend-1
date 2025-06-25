import { inject, injectable } from 'inversify';
import { redisTaskKey, redisTasksKey } from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { TaskEntity } from '../../database/entities/task.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { NotFoundException } from '../../exceptions';
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
      return { limit, offset, cacheTasks };
    }

    const { rows, count } = await TaskEntity.findAndCountAll({
      limit,
      offset,
      attributes: ['title', 'status', 'importance', 'description'],
      include: [{ model: UserEntity, attributes: ['id', 'name'] }],
    });
    if (!rows) {
      throw new NotFoundException('Задач не найдено');
    }

    await this.redis.set(redisTasksKey(limit, offset), rows, { EX: 300 });

    return { total: count, limit, offset, rows };
  }

  async getTaskById(idTask: TaskEntity['id']) {
    logger.info(`Чтение задачи по id=${idTask}`);

    const cacheTask = await this.redis.get<TaskEntity>(redisTaskKey(idTask));

    if (cacheTask) {
      return cacheTask;
    }

    const task = await TaskEntity.findOne({
      where: { id: idTask },
      attributes: ['title', 'status', 'importance', 'description'],
      include: [{ model: UserEntity, attributes: ['id', 'name'] }],
    });

    if (!task) {
      throw new NotFoundException('Такой задачи не найдено');
    }

    await this.redis.set(redisTaskKey(idTask), task, { EX: 300 });

    return { task };
  }

  async createTask(dto: CreateTaskDto) {
    logger.info(`Создание задачи`);

    await this.findUser(dto.assigneeId);

    const newTask = await TaskEntity.create({
      ...dto,
    });

    return await TaskEntity.findOne({
      where: { id: newTask.id },
      attributes: ['title', 'status', 'importance', 'description'],
      include: [{ model: UserEntity, attributes: ['id', 'name'] }],
    });
  }

  async updateTask(dto: CreateTaskDto, idTask: TaskEntity['id']) {
    logger.info(`Изменение задачи по id=${idTask}`);

    await this.getTaskById(idTask);

    await this.findUser(dto.assigneeId);

    await TaskEntity.update(dto, { where: { id: idTask } });

    return { message: `Обновлена задача ${idTask}` };
  }

  async deleteOne(id: TaskEntity['id']) {
    logger.info(`Удаление задачи id=${id}`);

    await this.getTaskById(id);

    const deleted = await TaskEntity.destroy({ where: { id } });

    return { success: Boolean(deleted) };
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
