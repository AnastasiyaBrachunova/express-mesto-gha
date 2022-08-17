const router = require("express").Router();
const {
  changeUserInfo,
  changeAvatar,
  likeCard,
  dislikeCard,
  getCards,
  createCards,
  deleteCard,
} = require("../controllers/cards");

router.get("/cards", getCards); // возвращает все карточки
router.post("/cards", createCards); // создает карточку
router.delete("/cards/:cardId", deleteCard); // удаляеn карточку по айди

router.patch("/users/me", changeUserInfo); // обновление профиля
router.patch("/users/me/avatar", changeAvatar); // бновление аватара

router.put("/cards/:id/likes", likeCard); // лайк карточки
router.delete("/cards/:cardId/likes", dislikeCard); // дизлайк карточки

module.exports = router;
