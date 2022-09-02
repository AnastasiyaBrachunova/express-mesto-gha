const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');


// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new AuthorizationError('Ошибка авторизации'))
  }

  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthorizationError('Ошибка авторизации'))

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = auth;
