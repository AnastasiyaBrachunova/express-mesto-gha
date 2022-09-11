const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

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

console.log(JWT_SECRET);

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Ошибка авторизации'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

    console.log('front', token);
    console.log('Setver', JWT_SECRET);
  } catch (err) {
    next(new AuthorizationError('Ошибка авторизации - 1'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = auth;
