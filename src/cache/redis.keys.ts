import { TaskEntity, UserEntity } from '../database';
import { GetTaskListDto } from '../modules/task/dto/sort-by.dto';
import { RefreshTokenDto } from '../modules/user/dto';

export const redisTaskKey = (id: TaskEntity['id']) => `task:${id}`;
export const redisTasksKey = (query: GetTaskListDto) =>
  `tasks:limit=${query.limit}:offset=${query.offset}:sortBy=${query.sortBy}:sortDirection=${query.sortDirection}`;
export const redisRefreshTokenKey = (refreshToken: RefreshTokenDto['refreshToken']) =>
  `refresh:${refreshToken}`;
export const redisAuthoredTask = (query: GetTaskListDto, authorId: UserEntity['id']) =>
  `tasksAuthored:limit=${query.limit}:offset=${query.offset}:sortBy=${query.sortBy}:sortDirection=${query.sortDirection}:search=${query.search}:authoredId=${authorId}`;
export const redisAssignedTask = (query: GetTaskListDto, assigneeId: UserEntity['id']) =>
  `tasksAssigned:limit=${query.limit}:offset=${query.offset}:sortBy=${query.sortBy}:sortDirection=${query.sortDirection}:search=${query.search}:authoredId=${assigneeId}`;
export const redisTmpDomain = (domain: string) => `tmpDomain:domain=${domain}`;
