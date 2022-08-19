const router = require('express').Router();
const {
  createUser,
  getUser,
  getUsers,
  changeUserInfo,
  changeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // получение всех пользователей
router.get('/users/:userId', getUser); // получение информации пользователя по айди
router.post('/users', createUser); // создание пользователя
router.patch('/users/me', changeUserInfo); // обновление профиля
router.patch('/users/me/avatar', changeAvatar); // бновление аватара

module.exports = router;
