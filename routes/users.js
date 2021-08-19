const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');
const urlValidation = require('../utils/utils');

router.get('/', getAllUsers);

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}),
updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidation),
  }),
}),
updateAvatar);

module.exports = router;
