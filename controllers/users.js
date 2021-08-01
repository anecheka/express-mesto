const mongoose = require('mongoose');
const User = require('../models/user');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../utils/utils');

module.exports.doesUserExist = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Такого пользователя не существует' });
        return;
      }
      next();
    });
};

module.exports.isUserIdValid = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(ERROR_BAD_REQUEST).send({ message: 'Невалидный ID пользователя' });
  }
  next();
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Данные неполные или заполнены некорректно' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось создать пользователя' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось получить информацию о пользователе' }));
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось загрузить пользователей' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Данные неполные или заполнены некорректно' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось обновить информацию о пользователе' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      runValidators: true,
      new: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Данные неполные или заполнены некорректно' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось обновить информацию о пользователе' });
      }
    });
};
