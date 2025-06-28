import { TaskEntity } from '../database';

export const redisTaskKey = (id: TaskEntity['id']) => `task:${id}`;
export const redisTasksKey = (limit: number, offset: number) =>
  `task:limit=${limit}:offset=${offset}`;
export const redisRefreshTokenKey = (refreshToken: string) => `refresh:${refreshToken}`;
