const router = require('express').Router();
const {
  getUser,
  getUsers,
  changeUserInfo,
  changeAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.patch('/users/me', changeUserInfo);
router.patch('/users/me/avatar', changeAvatar);
router.get('/users/:id', getUser);

module.exports = router;
