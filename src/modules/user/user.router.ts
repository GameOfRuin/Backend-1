import express, { Request, Response } from 'express';
import logger from '../../logger';
import { validate } from '../../validate';
import { LoginUserDto, RegisterUserDto } from './DTO';

export const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
  const userData = validate(RegisterUserDto, req.body);
  logger.info(`Пришли данные для регистрации. email = ${userData.email}`);

  res.json(userData);
});

userRouter.post('/login', (req: Request, res: Response) => {
  const userData = validate(LoginUserDto, req.body);
  logger.info(`Пришли данные для логина. email = ${userData.email}`);

  res.json(userData);
});
