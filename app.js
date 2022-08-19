const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

const app = express(); // создали приложение

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
// , {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//     useFindAndModify: false
// });  // мы указываем эти опции, чтобы приложение вскоре не сломалось.

app.use(express.json({ type: '*/*' }));

app.use((req, res, next) => {
  req.user = {
    _id: '62fd5a1917dd7601e4b08312',
  };
  next();
});

// app.use(express.static(path.join(__dirname,'public')))
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// app.get('/', (req, res)=>{
//   res.send('hello')
// }) //при гет запросе на / будет выполняться коллбэк

app.listen(PORT); // запускаем сервер на порту 3000
