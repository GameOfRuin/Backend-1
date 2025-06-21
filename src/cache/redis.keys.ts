export const redisTaskKey = (idTask: number) => `task:${idTask}`;
export const redisTasksKey = (limit: number, offset: number) =>
  `task:limit=${limit}:offset=${offset}`;
