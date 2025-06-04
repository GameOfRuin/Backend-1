import express, { Request, Response } from 'express';
import logger from '../../logger';
import { validation } from '../../validation/validation';
import { IdNumberDto } from './DTO';

export const scriptRouter = express.Router();

scriptRouter.get('/:numberScript', (req: Request, res: Response) => {
  const numberScript = { id: Number(req.params.numberScript) };

  validation(IdNumberDto, numberScript);

  res.json({ message: `Ваш скрипт под номером ${Number(req.params.numberScript)}` });
});

scriptRouter.get('/', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  logger.info(`Пришел запрос на чтение скриптов`);
});

scriptRouter.get('/complexScripts/:number', (req: Request, res: Response) => {
  const numberComplexScript = req.params.number;

  validation(IdNumberDto, numberComplexScript);

  res.json({ message: `Ваш скрипт под номером ${Number(req.params.numberScript)}` });
});

scriptRouter.get('/complexScripts', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  logger.info(`Пришел запрос на чтение сложных скриптов`);
});
