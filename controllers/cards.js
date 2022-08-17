const card = require("../models/card"); // экспортироали модель карточки

// class AplicationError extends Error {
//   constructor(status = 500, message = "Internal Error") {
//     super();
//     this.status = status;
//     this.name = this.constructor.name;
//     this.message = message;
//   }
// }

// class CardNotFound extends AplicationError {
//   constructor() {
//     super(404, "Card not found");
//   }
// }


const getCards = (req, res) => {
  return card
    .find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((error) => {
      res.status(500).send({ message: `Internal server error ${error}` });
      }
    )};

const createCards = (req, res) => {
  const { name, link } = req.body;
   card
  .create({name, link, owner: req.user._id})
  .then((card) => res.status(201).send({data: card}))
  .catch((error) => {
    if (error.name === "ValidationError") {
      res.status(400).send({ message: `Error validating card ${error}` });
    } else {
      res.status(500).send({ message: `Internal server error ${error}` });
    }
  });
};


const deleteCard = (req, res) => {};

const changeUserInfo = (req, res) => {};
const changeAvatar = (req, res) => {};
const likeCard = (req, res) => {};
const dislikeCard = (req, res) => {};

module.exports = {
  changeUserInfo,
  changeAvatar,
  likeCard,
  dislikeCard,
  getCards,
  createCards,
  deleteCard,
};
