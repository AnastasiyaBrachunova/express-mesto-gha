const jwt = require('jsonwebtoken');

const JWT_SECRET = 'veryhiddensecretfullofsecrets';

const getJwtToken = (id) => jwt.sign(id, JWT_SECRET, { expiresIn: '7d' });

const isAuthorized = async (token) => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (e) {
    return false;
  }
};

module.exports = {
  getJwtToken,
  isAuthorized,
};
