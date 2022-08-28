

// module.exports = async (req, res, next) => {
//   const { authorization } = req.headers;
//   const isAuth = await authorization.replace('Bearer ', '');
//   if (!isAuth) return res.status(401).send({ message: 'Необходима авторизация' });
//   next();
// };

// const jwt = require('jsonwebtoken');

// // eslint-disable-next-line consistent-return
// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return res.status(401).send({ message: 'Необходима авторизация' });
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (error) {
//     return res.status(401).send({ message: 'Необходима авторизация' });
//   }
//   req.user = payload;
//   next();
// };
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');
// const JWT_SECRET = 'veryhiddensecretfullofsecrets';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

// module.exports = {
//   auth,
// };
