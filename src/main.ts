import express, { Request, Response } from 'express';

const server = express();

server.use(express.json());

server.get('/', (req: Request, res: Response) => {
  console.log('Пришел Get');
});

server.get('/script/complexScripts', (req: Request, res: Response) => {
  const filterComplexScripts = req.query;
  res.json(filterComplexScripts);
  console.log(`Пришел запрос на сложные скрипты`);
});

server.get('/script/:numberScript', (req: Request, res: Response) => {
  const numberScript = req.params.numberScript;
  console.log(`Пришел запрос на номер скрипта ${numberScript}`);
});

server.get('/script/complexScripts/:number', (req: Request, res: Response) => {
  const numberScript = req.params.number;
  console.log(`Пришел запрос на номер сложного скрипта ${numberScript}`);
});

server.post('/register', (req: Request, res: Response) => {
  const numberScript = req.body;
  console.log(`Пришли данные для регистрации ${numberScript}`);
  res.json(numberScript);
});

server.listen(3000, () => {
  console.log('Get');
});
