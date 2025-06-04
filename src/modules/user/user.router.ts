import express, { Request, Response } from 'express';
import logger from '../../logger';
import { validation } from '../../validation/validation';
import { LoginrUserDto, RegisterUserDto } from './DTO';

export const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
  const userData = req.body;
  logger.info(`Пришли данные для регистрации. name = ${userData.name} и password = ${userData.password}`);

  validation(RegisterUserDto, userData);

  res.json(userData);
});

userRouter.post('/login', (req: Request, res: Response) => {
  const userData = req.body;
  logger.info(`Пришли данные для регистрации. name = ${userData.name} и password = ${userData.password}`);

  validation(LoginrUserDto, userData);

  res.json(userData);
});
