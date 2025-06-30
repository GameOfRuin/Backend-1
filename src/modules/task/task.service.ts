import { inject, injectable } from 'inversify';
import { FindOptions, Op } from 'sequelize';
import {
  redisAssignedTask,
  redisAuthoredTask,
  redisTaskKey,
  redisTasksKey,
} from '../../cache/redis.keys';
import { RedisService } from '../../cache/redis.service';
import { TaskEntity, UserEntity } from '../../database';
import { NotFoundException } from '../../exceptions';
import logger from '../../logger';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto';
import { GetTaskListDto } from './dto/sort-by.dto';
import { UpdateTaskDto } from './dto/update.dto';

@injectable()
export class TaskService {
  constructor(
    @inject(RedisService) private readonly redis: RedisService,
    @inject(UserService) private readonly user: UserService,
  ) {}

  async getTasks(dto: GetTaskListDto) {
    logger.info(`Запрос на чтение списка задач`);

    const { limit, offset, sortBy, sortDirection, search } = dto;

    const cacheTasks = await this.redis.get<TaskEntity>(redisTasksKey(limit, offset));

    if (cacheTasks) {
      return cacheTasks;
    }

    const options: FindOptions = {
      offset,
      limit,
      order: [[sortBy, sortDirection]],
    };

    if (search) {
      const likePattern = `%${search}%`;
      options.where = {
        ...options.where,
        [Op.or]: {
          id: { [Op.iLike]: likePattern },
          title: { [Op.iLike]: likePattern },
          description: { [Op.iLike]: likePattern },
        },
      };
    }

    const { rows, count: total } = await TaskEntity.findAndCountAll(options);

    if (!rows) {
      throw new NotFoundException('Задач не найдено');
    }
    const response = { total, limit, offset, rows };
    await this.redis.set(redisTasksKey(limit, offset), response, { EX: 300 });

    return response;
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
      include: [
        { model: UserEntity, as: 'authored', attributes: ['id', 'name'] },
        { model: UserEntity, as: 'assignee', attributes: ['id', 'name'] },
      ],
    });

    if (!task) {
      throw new NotFoundException('Такой задачи не найдено');
    }

    await this.redis.set(redisTaskKey(idTask), task, { EX: 300 });

    return task;
  }

  async getAuthored(dto: GetTaskListDto, authoredId: UserEntity['id']) {
    logger.info(`Чтение задач по id = ${authoredId}`);

    const { limit, offset, sortBy, sortDirection, search } = dto;

    const cacheTasks = await this.redis.get<TaskEntity>(
      redisAuthoredTask(limit, offset, sortBy, sortDirection, authoredId, search),
    );

    if (cacheTasks) {
      return cacheTasks;
    }

    const options: FindOptions = {
      offset,
      limit,
      where: { authoredId },
      order: [[sortBy, sortDirection]],
    };

    if (search) {
      const likePattern = `%${search}%`;
      options.where = {
        ...options.where,
        [Op.or]: {
          title: { [Op.iLike]: likePattern },
          description: { [Op.iLike]: likePattern },
        },
      };
    }

    const { rows, count: total } = await TaskEntity.findAndCountAll(options);

    const response = { total, authoredId, limit, offset, rows };
    await this.redis.set(
      redisAuthoredTask(limit, offset, sortBy, sortDirection, authoredId, search),
      response,
      { EX: 300 },
    );

    return response;
  }

  async getAssigned(dto: GetTaskListDto, assigneeId: UserEntity['id']) {
    logger.info(`Чтение задач по id = ${assigneeId}`);

    const { limit, offset, sortBy, sortDirection, search } = dto;

    const cacheTasks = await this.redis.get<TaskEntity>(
      redisAssignedTask(limit, offset, sortBy, sortDirection, assigneeId, search),
    );

    if (cacheTasks) {
      return cacheTasks;
    }

    const options: FindOptions = {
      offset,
      limit,
      where: { assigneeId },
      order: [[sortBy, sortDirection]],
    };

    if (search) {
      const likePattern = `%${search}%`;
      options.where = {
        ...options.where,
        [Op.or]: {
          title: { [Op.iLike]: likePattern },
          description: { [Op.iLike]: likePattern },
        },
      };
    }

    const { rows, count: total } = await TaskEntity.findAndCountAll(options);

    const response = { total, assigneeId, limit, offset, rows };
    await this.redis.set(
      redisAssignedTask(limit, offset, sortBy, sortDirection, assigneeId, search),
      response,
      { EX: 300 },
    );

    return response;
  }

  async createTask(dto: CreateTaskDto) {
    logger.info(`Создание задачи`);

    if (dto.assigneeId) await this.user.findUser(dto.assigneeId);

    const newTask = await TaskEntity.create({
      ...dto,
    });

    return await this.getTaskById(newTask.id);
  }

  async updateTask(dto: UpdateTaskDto, idTask: TaskEntity['id']) {
    logger.info(`Изменение задачи по id=${idTask}`);

    await this.getTaskById(idTask);

    await this.user.findUser(dto.assigneeId);

    await TaskEntity.update(dto, { where: { id: idTask } });

    await this.redis.delete(redisTaskKey(idTask));

    return await this.getTaskById(idTask);
  }

  async deleteOne(id: TaskEntity['id']) {
    logger.info(`Удаление задачи id=${id}`);

    await this.getTaskById(id);

    const deleted = await TaskEntity.destroy({ where: { id } });

    return { success: Boolean(deleted) };
  }
}
