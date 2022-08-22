const Card = require('../models/card'); // экспортироали модель карточки

const { BAD_REQUEST, ERROR_NOTFOUND, SERVER_ERROR } = require('../utils/constants');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((error) => {
    res.status(500).send({ message: `Internal server error ${error}` });
  });

const createCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((like) => res.send(like))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для лайка' });
      } else if (error.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((like) => res.send(like))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для дизлайка' });
      } else if (error.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ message: `Карточка c ${card.id} успешно удалена` }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для удаления' });
      } else if (error.statusCode === ERROR_NOTFOUND) {
        res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  likeCard,
  dislikeCard,
  getCards,
  createCards,
  deleteCard,
};
