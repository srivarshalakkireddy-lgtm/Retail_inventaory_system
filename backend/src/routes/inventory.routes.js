const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryByLocation,
  adjustInventory,
} = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getInventory);
router.get('/location/:locationId', getInventoryByLocation);
router.post('/adjust', authorize('admin', 'manager', 'staff'), adjustInventory);

module.exports = router;
