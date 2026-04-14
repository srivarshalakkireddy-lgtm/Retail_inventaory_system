const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboardStats);

module.exports = router;
