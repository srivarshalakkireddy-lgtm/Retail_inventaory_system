const { Supplier } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private
 */
const getSuppliers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', is_active = '' } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (is_active !== '') {
      where.is_active = is_active === 'true';
    }

    const { count, rows } = await Supplier.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
    });

    paginatedResponse(res, rows, page, limit, count, 'Suppliers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single supplier
 * @route   GET /api/suppliers/:id
 * @access  Private
 */
const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return errorResponse(res, 'Supplier not found', 404);
    }

    successResponse(res, supplier, 'Supplier retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create supplier
 * @route   POST /api/suppliers
 * @access  Private (Admin, Manager)
 */
const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    successResponse(res, supplier, 'Supplier created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update supplier
 * @route   PUT /api/suppliers/:id
 * @access  Private (Admin, Manager)
 */
const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);

    if (!supplier) {
      return errorResponse(res, 'Supplier not found', 404);
    }

    await supplier.update(req.body);
    successResponse(res, supplier, 'Supplier updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
};
