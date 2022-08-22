const User = require('../models/user');

const { BAD_REQUEST, ERROR_NOTFOUND, SERVER_ERROR } = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const getUser = (req, res) => User.findById(req.params.id)
  .orFail(() => {
    const error = new Error();
    error.statusCode = 404;
    throw error;
  })
  .then((user) => res.send(user))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователя' });
    } else if (error.statusCode === ERROR_NOTFOUND) {
      res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователей' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
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

const changeAvatar = (req, res) => {
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
};
