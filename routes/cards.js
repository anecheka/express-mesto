const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  doesCardExist, isCardIdValid, createCard, deleteCard, getAllCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(/https?:\/\/(www\.)?[a-z0-9\-\.\_~\:\/\?\#\[\]@\!$\&’\(\)*\+,;=]{1,}#?/),
  }),
}),
createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}),
isCardIdValid, doesCardExist, deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}),
isCardIdValid, doesCardExist, likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}),
isCardIdValid, doesCardExist, dislikeCard);

module.exports = router;
