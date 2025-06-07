import express, { Request, Response } from 'express';
import logger from '../../logger';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validation';
import { CreateTaskDto } from './DTO';

export const taskRouter = express.Router();

taskRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = validate(IdNumberDto, req.params);
  logger.info(`Чтение задачи по id=${id}`);
  res.json({ message: `Вы пытаетесь прочитать задачу id=${id}` });
});

taskRouter.get('/', (req: Request, res: Response) => {
  logger.info(`Чтение списка задач`);
  res.json(req.query);
});

taskRouter.post('/', (req: Request, res: Response) => {
  const body = req.body;

  const dto = validate(CreateTaskDto, body);

  res.json({ message: 'Вы создали задачу' });
});
