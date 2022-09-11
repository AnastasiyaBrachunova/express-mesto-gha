const jwt = require('jsonwebtoken');
// const AuthorizationError = require('../errors/AuthorizationError');

// const { NODE_ENV, JWT_SECRET } = process.env;

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
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
