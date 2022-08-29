const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { BAD_REQUEST, ERROR_NOTFOUND, SERVER_ERROR } = require('../utils/constants');

const { isAuthorized } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const getUsers = (req, res) => User.find({}) // получение всех пользователей
  .then((users) => res.send(users))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователей' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const getCurrentUser = (req, res, next) => { // получение текущего (авторизованного) пользователя
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователя' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        next(err);
      }
    });
};

// const getCurrentUser = (req, res) => {
//   const userId = req.user._id;
//   User.findById(userId)
//     .orFail(() => {
//       const error = new Error();
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((user) => res.send(user))
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователя' });
//       } else if (error.statusCode === ERROR_NOTFOUND) {
//         res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
//       } else {
//         res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

// const getUser = async (req, res) => {
//   const isAuth = await isAuthorized(req.headers.authorization);
//   if (!isAuth) return res.status(401).send({ message: 'Необходима авторизация' });
//   return User.findById(req.params.id)
//     .orFail(() => {
//       const error = new Error();
//       error.statusCode = 404;
//       throw error;
//     })
//     .then((user) => res.send(user))
//     .catch((error) => {
//       if (error.name === 'CastError') {
//         res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователя' });
//       } else if (error.statusCode === ERROR_NOTFOUND) {
//         res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
//       } else {
//         res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

const getUser = (req, res, next) => { // получение пользователя по айдишнику
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователя' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        next(err);
      }
    });
};

const createUser = (req, res) => { // создание пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) return res.status(BAD_REQUEST).send({ message: 'Email или пароль не могут быть пустыми' });
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({ message: `Пользователь ${email} успешно создан!` }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (error.code === 11000) {
        res.status(409).send({ message: 'Такой пользователь уже существует' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

// const login = (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) { return res.status(401).send({ message: 'Email или пароль не могут быть пустыми' }); }
//   User.findOne({ email })
//     .then((user) => {
//       if (!user) return res.status(401).send({ message: 'Неправльные почта или пароль' });
//       return bcrypt.compare(password, user.password)
//         .then((isValidPassword) => {
//           if (!isValidPassword) return res.status(401).send({ message: 'Неправльные почта или пароль' });
//           const token = getJwtToken({ id: req.user._id });
//           res.status(201).send({ token });
//         });
//     })
//     .catch((error) => {
//       if (error.name === 'ValidationError') {
//         res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
//       } else if (error.code === 11000) {
//         res.status(409).send({ message: 'Такой пользователь уже существует' });
//       } else {
//         res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
//       }
//     });
// };

const login = (req, res) => { // авторизация(получение токена)
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (error.code === 11000) {
        res.status(409).send({ message: 'Такой пользователь уже существует' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const changeUserInfo = (req, res) => { // изменение информации пользователя
  const { name, about } = req.body;
  User.findByIdAndUpdate({ name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении данных пользователя' });
      } else if (error.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const changeAvatar = (req, res) => { // изменение аватара
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((ava) => res.send(ava))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (error.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  changeUserInfo,
  changeAvatar,
  login,
  getCurrentUser,
};
