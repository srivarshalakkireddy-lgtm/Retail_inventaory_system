const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
    });

    successResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private (Admin)
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private (Admin)
 */
const createUser = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, phone, role, is_active } = req.body;
    
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password || 'Test@123', salt);

    const user = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role,
      is_active: is_active ?? true
    });

    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password_hash;

    successResponse(res, userWithoutPassword, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
const updateUser = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, phone, role, is_active } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const updateData = {
      email,
      first_name,
      last_name,
      phone,
      role,
      is_active
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    await user.update(updateData);

    const userWithoutPassword = { ...user.toJSON() };
    delete userWithoutPassword.password_hash;

    successResponse(res, userWithoutPassword, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
};
