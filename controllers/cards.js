const mongoose = require('mongoose');
const Card = require('../models/card');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../utils/utils');

module.exports.doesCardExist = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточки с таким ID не существует' });
        return;
      }
      next();
    });
};

module.exports.isCardIdValid = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    res.status(ERROR_BAD_REQUEST).send({ message: 'Невалидный ID карточки' });
  }
  next();
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Данные неполные или заполнены некорректно' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось создать карточку' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось удалить карточку с таким ID' }));
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось загрузить список карточек' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось обновить количество лайков' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Не удалось обновить количество лайков' });
    });
};
