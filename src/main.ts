import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import { Container } from 'inversify';
import { logRoutes } from './bootstrap';
import { appConfig } from './config';
import { connectToPostgresql } from './database';
import logger from './logger';
import { errorHandler } from './middlewares';
import { ScriptController } from './modules/script/script.controller';
import ScriptModule from './modules/script/script.module';
import { TaskController } from './modules/task/task.controller';
import TaskModule from './modules/task/task.module';
import { UserController } from './modules/user/user.controller';
import UserModule from './modules/user/user.module';

const bootstrap = async () => {
  await connectToPostgresql();

  const appContainer = new Container();

  await appContainer.load(UserModule, TaskModule, ScriptModule);

  const server = express();

  server.use(express.json());

  const userController = appContainer.get(UserController);
  const taskController = appContainer.get(TaskController);
  const scriptController = appContainer.get(ScriptController);
  server.use('/user', userController.router);
  server.use('/task', taskController.router);
  server.use('/script', scriptController.router);

  server.use(errorHandler);

  logRoutes(server);

  server.listen(appConfig.port, () => {
    logger.info(`Server started on port ${appConfig.port}`);
  });
};

bootstrap();
