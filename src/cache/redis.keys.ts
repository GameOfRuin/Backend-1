import { TaskEntity, UserEntity } from '../database';
import { TaskSortByEnum } from '../modules/task/dto/sort-by.dto';
import { RefreshTokenDto } from '../modules/user/dto';
import { SortDirectionEnum } from '../shared';

export const redisTaskKey = (id: TaskEntity['id']) => `task:${id}`;
export const redisTasksKey = (limit: number, offset: number) =>
  `tasks:limit=${limit}:offset=${offset}`;
export const redisRefreshTokenKey = (refreshToken: RefreshTokenDto['refreshToken']) =>
  `refresh:${refreshToken}`;
export const redisAuthoredTask = (
  limit: number,
  offset: number,
  sortBy: TaskSortByEnum,
  sortDirection: SortDirectionEnum,
  authoredId: UserEntity['id'],
  search?: string,
) =>
  `tasksAuthored:${redisTasksKey(limit, offset)}:sortBy=${sortBy}:sortDirection=${sortDirection}:search=${search}:authoredId=${authoredId}`;
