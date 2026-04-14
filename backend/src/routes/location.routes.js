const express = require('express');
const router = express.Router();
const { getLocations, getLocation } = require('../controllers/location.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getLocations);
router.get('/:id', getLocation);

module.exports = router;
