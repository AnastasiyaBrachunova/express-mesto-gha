const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV } = process.env;

// // eslint-disable-next-line consistent-return
// const auth = (req, res, next) => {
//   if (!req.cookies.jwt) {
//     next(new AuthorizationError('Ошибка авторизации'));
//   }

//   const token = req.cookies.jwt;
//   let payload;

//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (err) {
//     next(new AuthorizationError('Ошибка авторизации'));
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса

//   next(); // пропускаем запрос дальше
// };

// module.exports = auth;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Ошибка авторизации'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzFlMjMzNzYzOTBhNDAwMTQ2OTg4ZmUiLCJpYXQiOjE2NjI5MTk1Mjd9.MCmJExp6U2cEJUueOX37ThLL3IU2IUoaIvCZoLtZgCc' : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Ошибка авторизации - 1'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = auth;
