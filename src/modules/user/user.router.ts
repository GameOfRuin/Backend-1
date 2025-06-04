import express, { Request, Response } from 'express';
import logger from '../../logger';

export const userRouter = express.Router();

userRouter.post('/register', (req: Request, res: Response) => {
  const numberScript = req.body;
  logger.info(`Пришли данные для регистрации. name = ${numberScript.name} и password = ${numberScript.password}`);
  res.json(numberScript);
});
