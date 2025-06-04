import express, { Request, Response } from 'express';
import logger from '../../logger';

export const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
  const userData = req.body;
  logger.info(`Пришли данные для регистрации. name = ${userData.name} и password = ${userData.password}`);
  res.json(userData);
});
