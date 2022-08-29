const router = require('express').Router();

const {
  createUser,
  login,
} = require('../controllers/users');

const {
  validateCreateUser,
  validateLogin,
} = require('../error/validatorJoi');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

module.exports = router;
