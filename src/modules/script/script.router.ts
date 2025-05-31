import express, { Request, Response } from 'express';
import logger from '../../logger';

export const scriptRouter = express.Router();

scriptRouter.get('/:numberScript', (req: Request, res: Response) => {
  const numberScript = req.params.numberScript;
  if (Number(numberScript) < 100) {
    res.json({ error: 'Ваш скрипт' });
    logger.info('Запрос  скрипта');
  } else {
    res.json({ error: 'Такого скрипта не существует' });
    logger.error('Запрос несуществующего скрипта');
  }
});

scriptRouter.get('/', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  logger.info(`Пришел запрос на чтение скриптов`);
});

scriptRouter.get('/complexScripts/:number', (req: Request, res: Response) => {
  const numberComplexScript = req.params.number;
  if (Number(numberComplexScript) < 5) {
    res.json({ error: 'Ваш скрипт' });
    logger.info(`Пришел запрос на номер сложного скрипта ${numberComplexScript}`);
  } else {
    res.json({ error: 'Такого скрипта не существует' });
    logger.error('Запрос несуществующего скрипта');
  }
});

scriptRouter.get('/complexScripts', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  logger.info(`Пришел запрос на чтение сложных скриптов`);
});
