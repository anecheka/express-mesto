const router = require('express').Router();
const {
  doesCardExist, isCardIdValid, createCard, deleteCard, getAllCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', isCardIdValid, doesCardExist, deleteCard);
router.put('/:cardId/likes', isCardIdValid, doesCardExist, likeCard);
router.delete('/:cardId/likes', isCardIdValid, doesCardExist, dislikeCard);

module.exports = router;
