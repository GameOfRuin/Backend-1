import express, { Request, Response } from 'express';
import logger from './logger';

const server = express();

server.use(express.json());

server.get('/', (req: Request, res: Response) => {
  logger.info('Пришел Get');
});

server.get('/script/complexScripts', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  logger.info(`Пришел запрос на сложные скрипты`);
});

server.get('/script/:numberScript', (req: Request, res: Response) => {
  const numberScript = req.params.numberScript;
  if (Number(numberScript) < 100) {
    res.json({ error: 'Ваш скрипт' });
    logger.info('Запрос  скрипта');
  } else {
    res.json({ error: 'Такого скрипта не существует' });
    logger.error('Запрос несуществующего скрипта');
  }
});

server.get('/script/complexScripts/:number', (req: Request, res: Response) => {
  const numberComplexScript = req.params.number;
  if (Number(numberComplexScript) < 5) {
    res.json({ error: 'Ваш скрипт' });
    logger.info(`Пришел запрос на номер сложного скрипта ${numberComplexScript}`);
  } else {
    res.json({ error: 'Такого скрипта не существует' });
    logger.error('Запрос несуществующего скрипта');
  }
});

server.post('/register', (req: Request, res: Response) => {
  const numberScript = req.body;
  logger.info(`Пришли данные для регистрации. name = ${numberScript.name} и password = ${numberScript.password}`);
  res.json(numberScript);
});

server.listen(3000, () => {
  console.log('Get');
});
