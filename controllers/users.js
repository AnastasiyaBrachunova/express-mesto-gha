const User = require('../models/user');

const createUser = (req, res) => User.create(req.body)
  .then((user) => res.status(201).send(user))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(400).send({ message: `Error validating user ${error}` });
    } else {
      res.status(500).send({ message: `Internal server error ${error}` });
    }
  });

// const getUser = (req, res) => User.findById(req.params.id)
//   .orFail(() => {
//     const error = new Error();
//     error.statusCode = 404;
//     throw error;
//   })
//   .then((user) => res.status(200).send(user))
//   .catch((error) => {
//     if (error.name === 'ValidatorError') {
//       res.status(error.status).send(error);
//     } else {
//       res.status(500).send({ message: `Пользователь с указанным _id не найден ${error}` });
//     }
//   });
const getUser = (req, res) => User.findById(req.params.id)
  .orFail(() => {
    const error = new Error();
    error.statusCode = 404;
    throw error;
  })
  .then((user) => res.status(200).send(user))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${error}` });
    } else if (error.statusCode === 404) {
      res.status(error.statusCode).send({ message: `Пользователь с указанным _id не найден ${error}` });
    } else {
      res.status(500).send({ message: `Internal server error ${error}` });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при запросе пользователя ${error}` });
    } else {
      res.status(500).send({ message: `Internal server error ${error}` });
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
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении данных пользователя ${error}` });
      } else if (error.statusCode === 404) {
        res.status(error.statusCode).send({ message: `Пользователь с указанным _id не найден ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
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
    .then((ava) => res.status(200).send(ava))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при обновлении аватара ${error}` });
      } else if (error.statusCode === 404) {
        res.status(error.statusCode).send({ message: `Пользователь с указанным _id не найден ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
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
