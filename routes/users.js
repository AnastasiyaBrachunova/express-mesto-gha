const router = require('express').Router();
const {
  getUser,
  getUsers,
  changeUserInfo,
  changeAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers); // показать всех пользователей
router.get('/users/me', getCurrentUser); // получить авторизованного пользователя
router.get('/users/:id', getUser); // получить пользователя по айди
router.patch('/users/me', changeUserInfo); // обновить информцию пользователя
router.patch('/users/me/avatar', changeAvatar); // обновить аватар пользователя

module.exports = router;
