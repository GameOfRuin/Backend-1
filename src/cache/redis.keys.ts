import { TaskEntity } from '../database';
import { RefreshTokenDto } from '../modules/user/dto';

export const redisTaskKey = (id: TaskEntity['id']) => `task:${id}`;
export const redisTasksKey = (limit: number, offset: number) =>
  `task:limit=${limit}:offset=${offset}`;
export const redisRefreshTokenKey = (refreshToken: RefreshTokenDto['refreshToken']) =>
  `refresh:${refreshToken}`;
