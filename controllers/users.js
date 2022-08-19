/* eslint-disable consistent-return */
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
//     throw new UserNotFound();
//   })
//   .then((user) => res.status(200).send(user))
//   .catch((error) => {
//     if (error.name === 'ValidatorError') {
//       res.status(error.status).send(error);
//     } else {
//       res.status(500).send({ message: `Internal server error ${error}` });
//     }
//   });
const getUser = (req, res) => User.findById(req.params._id)
  .orFail(() => {
    const error = new Error('Пользователь с указанным _id не найден');
    error.statusCode = 404;
    throw error;
  })
  .then((user) => res.status(200).res.send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
    } else {
      res.status(500).send({ message: `Internal server error ${err}` });
    }
  });

const getUsers = (req, res) => User.find({})

  .then((users) => res.status(200).send(users))
  .catch((error) => {
    res.status(500).send({ message: `Internayl server error ${error}` });
  });

const changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

const changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((ava) => res.status(200).send(ava))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  changeUserInfo,
  changeAvatar,
};
