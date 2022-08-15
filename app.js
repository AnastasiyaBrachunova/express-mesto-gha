const mongoose = require('mongoose');
const express = require('express'); // импортировали экспресс
const path = require('path')
const usersRouter = require('./routes/users')
const app = express(); // создали приложение

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb')
// , {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//     useFindAndModify: false
// });  //логику взаимодействия MongoDB с Mongoose сейчас переписывают, и мы указываем эти опции, чтобы приложение вскоре не сломалось.

app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use('/', usersRouter);
// app.get('/', (req, res)=>{
//   res.send('hello')
// }) //при гет запросе на / будет выполняться коллбэк

app.listen(PORT, ()=>{
  console.log(`App is running on port ${PORT}`)
}) // запускаем сервер на порту 3000
