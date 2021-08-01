const Card = require('../models/card');

const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;

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

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err._message === 'card validation failed') {
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
