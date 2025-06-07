import express, { Request, Response } from 'express';
import logger from '../../logger';
import { IdNumberDto } from '../../shared';
import { validate } from '../../validation';

export const scriptRouter = express.Router();

scriptRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = validate(IdNumberDto, req.params);

  res.json({ message: `Ваш скрипт под номером ${id}` });
});

scriptRouter.get('/', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  logger.info(`Пришел запрос на чтение скриптов`);
});

scriptRouter.get('/complexScripts/:id', (req: Request, res: Response) => {
  const { id } = validate(IdNumberDto, req.params);

  res.json({ message: `Ваш сложный скрипт под номером ${id}` });
});

scriptRouter.get('/complexScripts', (req: Request, res: Response) => {
  res.json(req.query);
  logger.info(`Пришел запрос на чтение сложных скриптов`);
});
