const router = require('express').Router();
const {
  doesUserExist, isUserIdValid, createUser, getUser, getAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:userId', isUserIdValid, doesUserExist, getUser);
// router.patch('/me', doesUserExist); - ID захардкожено, проверка не проводится
router.patch('/me', updateUser);
// router.patch('/me/avatar', doesUserExist); - - ID захардкожено, проверка не проводится
router.patch('/me/avatar', updateAvatar);

module.exports = router;
