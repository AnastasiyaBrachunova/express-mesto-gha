const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const NotFoundError = require('./errors/NotFoundError');
const internalError = require('./errors/internalError');

const app = express(); // создали приложение

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRouter); // здесь роуты signup/signin
app.use(auth); // защита роутов авторизацией
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(internalError);

app.listen(PORT); // запускаем сервер на порту 3000
