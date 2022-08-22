const router = require('express').Router();
const {
  likeCard,
  dislikeCard,
  getCards,
  createCards,
  deleteCard,
} = require('../controllers/cards');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', createCards); // создает карточку
router.delete('/cards/:cardId', deleteCard); // удаляеn карточку по айди
router.put('/cards/:cardId/likes', likeCard); // лайк карточки
router.delete('/cards/:cardId/likes', dislikeCard); // дизлайк карточки

module.exports = router;
