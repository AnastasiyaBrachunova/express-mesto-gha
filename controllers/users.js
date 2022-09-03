const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const ConflictError = require('../errors/AuthorizationError');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => User.find({}) // получение всех пользователей
  .then((users) => res.send(users))
  .catch(next);

const getCurrentUser = (req, res, next) => { // получение текущего (авторизованного) пользователя
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для получения пользователя'));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для получения пользователя'));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => { // создание пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send(user.deletePasswordFromUser()))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(error);
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
    }).catch(() => {
      next(new AuthorizationError('Ошибка авторизации'));
    });
};

const changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((users) => res.send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении данных пользователя'));
      } else {
        next(error);
      }
    });
};

const changeAvatar = (req, res, next) => { // изменение аватара
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then((ava) => res.send(ava))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(error);
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
