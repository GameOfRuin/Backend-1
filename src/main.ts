import express from 'express';

const server = express();

server.get('/', (req, res) => {
  console.log('Пришел Get');

  res.json({ figure: '2' });
});

server.listen(3000, () => {
  console.log('Get');
});
