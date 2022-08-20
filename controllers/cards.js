const Card = require('../models/card'); // экспортироали модель карточки

// class AplicationError extends Error {
//   constructor(status = 500, message = 'Internal Error') {
//     super();
//     this.status = status;
//     this.name = this.constructor.name;
//     this.message = message;
//   }
// }

// class CardNotFound extends AplicationError {
//   constructor() {
//     super(404, 'Card not found');
//   }
// }

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((error) => {
    res.status(500).send({ message: `Internal server error ${error}` });
  });

const createCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные при создании карточки ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => res.send(like))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
    });
};

module.exports = {
  likeCard,
  dislikeCard,
  getCards,
  createCards,
  deleteCard,
};
