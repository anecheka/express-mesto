require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_KEY } = process.env;

module.exports = (req, res, next) => {
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(jwtCookie, JWT_KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
