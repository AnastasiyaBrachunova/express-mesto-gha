const router = require('express').Router();

const {
  likeCard,
  dislikeCard,
  getCards,
  createCards,
  deleteCard,
} = require('../controllers/cards');

const {
  validateСreateCards,
  validateGetCardId,
} = require('../error/validatorJoi');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', validateСreateCards, createCards); // создает карточку
router.delete('/cards/:cardId', validateGetCardId, deleteCard); // удаляеn карточку по айди
router.put('/cards/:cardId/likes', validateGetCardId, likeCard); // лайк карточки
router.delete('/cards/:cardId/likes', validateGetCardId, dislikeCard); // дизлайк карточки

module.exports = router;
