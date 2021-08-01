const router = require('express').Router();
const {
  doesCardExist, createCard, deleteCard, getAllCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', doesCardExist);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', doesCardExist);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', doesCardExist);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
