const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
} = require('../controllers/supplier.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSuppliers)
  .post(authorize('admin', 'manager'), createSupplier);

router.route('/:id')
  .get(getSupplier)
  .put(authorize('admin', 'manager'), updateSupplier);

module.exports = router;
