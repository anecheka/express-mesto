const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const InternalServerError = require('../errors/internal-server-err');

module.exports.doesCardExist = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с таким ID не существует');
      }
      next();
    })
    .catch(next);
};

module.exports.isCardIdValid = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) {
    throw new BadRequestError('Невалидный ID карточки');
  }
  next();
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные неполные или заполнены некорректно'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const ownerId = req.user._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.equals(ownerId)) {
        Card.deleteOne({ _id: card._id }, (err) => {
          if (err) {
            next(new InternalServerError('Проблема с удалением карточки'));
          }
          res.send({ data: card });
        });
      } else {
        next(new ForbiddenError('Недостаточно прав для удаления данной карточки'));
      }
    })
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(next);
};
