import 'reflect-metadata';
import { config } from 'dotenv';
import express from 'express';
import { logRoutes } from './bootstrap';
import { appConfig } from './config';
import logger from './logger';
import { errorHandler } from './middlewares';
import { taskRouter } from './modules/task/task.router';
import { userRouter } from './modules/user/user.router';

config();

const bootstrap = () => {
  const server = express();

  server.use(express.json());

  server.use('/task', taskRouter);
  server.use('/user', userRouter);

  server.use(errorHandler);

  logRoutes(server);

  server.listen(appConfig.port, () => {
    logger.info(`Server started on port ${appConfig.port}`);
  });
};

bootstrap();
