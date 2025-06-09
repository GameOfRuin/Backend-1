import 'reflect-metadata';
import express from 'express';
import * as process from 'node:process';
import { logRoutes } from './bootstrap';
import { appConfig } from './config';
import logger from './logger';
import { errorHandler } from './middlewares';
import { taskRouter } from './modules/task/task.router';
import { userRouter } from './modules/user/user.router';

console.log(process.env.PORT);

const bootstrap = () => {
  const server = express();

  server.use(express.json());

  server.use('/task', taskRouter);
  server.use('/user', userRouter);

  server.use(errorHandler);

  logRoutes(server);

  server.listen(3000, () => {
    logger.info(`Server started on port ${appConfig}`);
  });
};

bootstrap();
