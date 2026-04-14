const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.get('/:id', getOrder);
router.put('/:id/status', authorize('admin', 'manager'), updateOrderStatus);

module.exports = router;
