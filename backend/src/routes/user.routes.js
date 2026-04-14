const express = require('express');
const router = express.Router();
const { getUsers, getUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
