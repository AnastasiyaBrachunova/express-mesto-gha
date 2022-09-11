require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const cors = require('cors');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // ИМПОРТ ЛОГОВ

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const NotFoundError = require('./errors/NotFoundError');
const internalError = require('./errors/internalError');

const app = express(); // создали приложение

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

// const options = {
//   origin: [
//     'localhost:3010', // порт где крутится фронт
//     'https://abrachunova.front.nomoredomains.sbs', // созданный домен для фронта
//     'https://AnastasiyaBrachunova.github.io', // мой личный акк гита?
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ['Accept', 'X-Requested-With', 'Content-Type', 'Origin', 'Authorization'],
//   credentials: true,
// };

// app.use('*', cors(options));

// app.use(express.json({ type: '*/*' }));

const allowedCors = [
  'https://abrachunova.front.nomoredomains.sbs',
  'https://AnastasiyaBrachunova.github.io',
  'http://localhost:3010'];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use(express.json({ type: '*/*' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // ЛОГГЕР ЗАПРОСОВ

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', authRouter); // здесь роуты signup/signin
app.use(auth); // защита роутов авторизацией
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use(errorLogger); // ЛОГГЕР ОШИБОК

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(internalError);

app.listen(PORT); // запускаем сервер на порту 3000
