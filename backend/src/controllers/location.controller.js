const { Location } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * @desc    Get all locations
 * @route   GET /api/locations
 * @access  Private
 */
const getLocations = async (req, res, next) => {
  try {
    const { type = '', is_active = 'true' } = req.query;
    const where = {};

    if (type) {
      where.type = type;
    }

    if (is_active !== '') {
      where.is_active = is_active === 'true';
    }

    const locations = await Location.findAll({
      where,
      order: [['name', 'ASC']],
    });

    successResponse(res, locations, 'Locations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single location
 * @route   GET /api/locations/:id
 * @access  Private
 */
const getLocation = async (req, res, next) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      return errorResponse(res, 'Location not found', 404);
    }

    successResponse(res, location, 'Location retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLocations,
  getLocation,
};
