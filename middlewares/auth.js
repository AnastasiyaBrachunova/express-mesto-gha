const { isAuthorized } = require('../utils/jwt');

module.exports = async (req, res, next) => {
  const isAuth = await isAuthorized(req.headers.authorization);
  if (!isAuth) return res.status(401).send({ message: 'Необходима авторизация' });
  next();
};
