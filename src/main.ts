import express from 'express';
import { logRoutes } from './bootstrap';
import logger from './logger';
import { errorHandler } from './middlewares';
import { scriptRouter } from './modules/script/script.router';
import { userRouter } from './modules/user/user.router';

const bootstrap = () => {
  const server = express();

  server.use(express.json());

  server.use('/script', scriptRouter);
  server.use('/user', userRouter);

  server.use(errorHandler);

  logRoutes(server);

  server.listen(3000, () => {
    logger.info('Запуск сервера');
  });
};

bootstrap();
