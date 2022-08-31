const router = require('express').Router();

const {
  getUser,
  getUsers,
  changeUserInfo,
  changeAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateGetUser,
  validateChangeUserInfo,
  validateChangeAvatar,
} = require('../errors/validatorJoi');

router.get('/users', getUsers); // показать всех пользователей
router.get('/users/me', getCurrentUser); // получить авторизованного пользователя
router.get('/users/:id', validateGetUser, getUser); // получить пользователя по айди
router.patch('/users/me', validateChangeUserInfo, changeUserInfo); // обновить информцию пользователя
router.patch('/users/me/avatar', validateChangeAvatar, changeAvatar); // обновить аватар пользователя

module.exports = router;
