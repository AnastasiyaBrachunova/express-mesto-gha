const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс

const auth = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

const app = express(); // создали приложение

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json({ type: '*/*' }));

app.use((req, res, next) => {
  req.user = {
    _id: '62fd5a1917dd7601e4b08312',
  };
  next();
});

app.use('/', authRouter);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT); // запускаем сервер на порту 3000
