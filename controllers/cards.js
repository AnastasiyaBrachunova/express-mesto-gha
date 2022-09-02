const Card = require('../models/card'); // экспортироали модель карточки
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
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
        next(new BadRequest('Переданы некорректные данные для лайка'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new BadRequest('Переданы некорректные данные для дизлайка'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(error);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        next(new ForbiddenError('Удаление чужой карточки недоступно'));
      } else {
        Card.findByIdAndRemove(cardId)
        // eslint-disable-next-line no-shadow
          .then(() => {
            res.send({ message: 'Карточка успешно удалена' });
          });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else if (error.statusCode === 404) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(error);
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
