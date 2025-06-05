import express, { Request, Response } from 'express';
import logger from '../../logger';
import { validation } from '../../validation/validation';
import { IsEnumStatusDto } from './DTO';

export const taskRouter = express.Router();

taskRouter.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  logger.info(`Чтение задачи по id=${id}`);
  res.json({ message: `Вы пытаетесь прочитать задачу id=${id}` });
});

taskRouter.get('/', (req: Request, res: Response) => {
  logger.info(`Чтение списка задач`);
  res.json(req.query);
});

taskRouter.post('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  validation(IsEnumStatusDto, body);

  logger.info(`Чтение задачи по id=${id}`);
  res.json({
    message: `Вы пытаетесь прочитать задачу id=${id} статус задачи - ${body.status} важность - ${body.importance}`,
  });
});
