const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser);

module.exports = router;
