import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import { Container } from 'inversify';
import { logRoutes } from './bootstrap';
import RedisModule from './cache/redis.module';
import { appConfig } from './config';
import { connectToPostgresql } from './database';
import logger from './logger';
import RabbitMqModule from './message-broker/rabbitmq.module';
import { errorHandler } from './middlewares';
import { DepartmentController } from './modules/department/department.controller';
import DepartmentModule from './modules/department/department.module';
import JwtModule from './modules/jwt/jwt.module';
import { TaskController } from './modules/task/task.controller';
import TaskModule from './modules/task/task.module';
import TelegramModule from './modules/telegram/telegram.module';
import { UserAmqpController } from './modules/user/user.amqp-controller';
import { UserController } from './modules/user/user.controller';
import UserModule from './modules/user/user.module';

const bootstrap = async () => {
  await connectToPostgresql();

  const appContainer = new Container();

  await appContainer.load(
    UserModule,
    TaskModule,
    DepartmentModule,
    RedisModule,
    RabbitMqModule,
    JwtModule,
    TelegramModule,
  );

  const server = express();

  server.use(express.json());

  const userController = appContainer.get(UserController);
  const taskController = appContainer.get(TaskController);
  const departmentController = appContainer.get(DepartmentController);
  server.use('/user', userController.router);
  server.use('/task', taskController.router);
  server.use('/department', departmentController.router);

  appContainer.get(UserAmqpController);

  server.use(errorHandler);

  logRoutes(server);

  server.listen(appConfig.port, () => {
    logger.info(`Server started on port ${appConfig.port}`);
  });
};

bootstrap();
