const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const AuthorizationError = require('../errors/ServerError');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => User.find({}) // получение всех пользователей
  .then((users) => res.send(users))
  .catch(next);

const getCurrentUser = (req, res, next) => { // получение текущего (авторизованного) пользователя
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для получения пользователя'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(new ServerError('Внутренняя ошибка сервера'));
      }
    });
};

const getUser = (req, res, next) => { // получение пользователя по айдишнику
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для получения пользователя'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(new ServerError('Внутренняя ошибка сервера'));
      }
    });
};

const createUser = (req, res, next) => { // создание пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequest('Email или пароль не могут быть пустыми'));
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({ message: 'Пользователь успешно создан!' }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === 11000) {
        res.status(409).send({ message: 'Такой пользователь уже существует' });
      } else {
        next(new ServerError('Внутренняя ошибка сервера'));
      }
    });
};

const login = (req, res, next) => { // авторизация(получение токена)
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
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === 401) {
        next(new AuthorizationError('Ошибка авторизации'));
      } else {
        next(new ServerError('Внутренняя ошибка сервера'));
      }
    });
};

const changeUserInfo = (req, res, next) => { // изменение информации пользователя
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
        next(new BadRequest('Переданы некорректные данные при обновлении данных пользователя'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(new ServerError('Внутренняя ошибка сервера'));
      }
    });
};

const changeAvatar = (req, res, next) => { // изменение аватара
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
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(new ServerError('Внутренняя ошибка сервера'));
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
