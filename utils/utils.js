const isURL = require('validator/lib/isURL');
const BadRequestError = require('../errors/bad-request-err');

const urlValidationMethod = (value) => {
  const result = isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError('Ошибка валидации URL');
};

module.exports = urlValidationMethod;
