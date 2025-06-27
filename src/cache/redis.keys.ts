import { TaskEntity } from '../database/entities/task.entity';

export const redisTaskKey = (id: TaskEntity['id']) => `task:${id}`;
export const redisTasksKey = (limit: number, offset: number) =>
  `task:limit=${limit}:offset=${offset}`;
