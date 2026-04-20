const { Inventory, Product, Location } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * @desc    Get inventory
 * @route   GET /api/inventory
 * @access  Private
 */
const getInventory = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      location_id = '',
      product_id = '',
      low_stock = '',
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (location_id) {
      where.location_id = location_id;
    }

    if (product_id) {
      where.product_id = product_id;
    }

    const { count, rows } = await Inventory.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name', 'min_stock_level', 'reorder_point'],
        },
        {
          model: Location,
          as: 'location',
          attributes: ['id', 'code', 'name', 'type'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['updated_at', 'DESC']],
    });

    // Filter for low stock if requested
    let filteredRows = rows;
    if (low_stock === 'true') {
      filteredRows = rows.filter(
        (inv) => inv.quantity_available <= inv.product.reorder_point
      );
    }

    paginatedResponse(res, filteredRows, page, limit, count, 'Inventory retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get inventory by location
 * @route   GET /api/inventory/location/:locationId
 * @access  Private
 */
const getInventoryByLocation = async (req, res, next) => {
  try {
    const inventory = await Inventory.findAll({
      where: { location_id: req.params.locationId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'sku', 'name', 'unit_price'],
        },
      ],
    });

    successResponse(res, inventory, 'Inventory retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Adjust inventory
 * @route   POST /api/inventory/adjust
 * @access  Private (Admin, Manager, Staff)
 */
const adjustInventory = async (req, res, next) => {
  try {
    const { product_id, location_id, quantity, reason } = req.body;
    const updated_by = req.user.id;

    let inventory = await Inventory.findOne({
      where: { product_id, location_id },
    });

    if (!inventory) {
      // Create new inventory record
      inventory = await Inventory.create({
        product_id,
        location_id,
        quantity_available: quantity,
        last_adjustment_reason: reason,
        updated_by,
      });
    } else {
      // Update existing inventory
      const newQuantity = inventory.quantity_available + quantity;

      if (newQuantity < 0) {
        return errorResponse(res, 'Insufficient inventory', 400);
      }

      await inventory.update({
        quantity_available: newQuantity,
        last_adjustment_reason: reason,
        updated_by,
      });
    }

    const updatedInventory = await Inventory.findByPk(inventory.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Location, as: 'location' },
      ],
    });

    successResponse(res, updatedInventory, 'Inventory adjusted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  getInventoryByLocation,
  adjustInventory,
};
