const { getUsers, getUser, createUser, updateUser } = require('../../src/controllers/user.controller');
const { User } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));
jest.mock('bcryptjs');

// Mock response utilities
jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
}));
const { successResponse, errorResponse } = require('../../src/utils/response');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getUsers', () => {
    it('should return a list of all users successfully', async () => {
      // Arrange
      const fakeUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' }
      ];
      User.findAll.mockResolvedValue(fakeUsers);

      // Act
      await getUsers(req, res, next);

      // Assert
      expect(User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']],
      });
      expect(successResponse).toHaveBeenCalledWith(res, fakeUsers, 'Users retrieved successfully');
    });

    it('should call next with error if database fails', async () => {
      // Arrange
      const error = new Error('DB Error');
      User.findAll.mockRejectedValue(error);

      // Act
      await getUsers(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUser', () => {
    it('should return a single user if found', async () => {
      // Arrange
      req.params = { id: 1 };
      const fakeUser = { id: 1, email: 'admin@example.com' };
      User.findByPk.mockResolvedValue(fakeUser);

      // Act
      await getUser(req, res, next);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password_hash'] },
      });
      expect(successResponse).toHaveBeenCalledWith(res, fakeUser, 'User retrieved successfully');
    });

    it('should return error 404 if user not found', async () => {
      // Arrange
      req.params = { id: 999 };
      User.findByPk.mockResolvedValue(null);

      // Act
      await getUser(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'User not found', 404);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      // Arrange
      req.body = { email: 'new@example.com', password: 'password', role: 'manager' };
      User.findOne.mockResolvedValue(null); // No existing user
      
      bcrypt.genSalt.mockResolvedValue('fakeSalt');
      bcrypt.hash.mockResolvedValue('fakeHashedPassword');

      const fakeCreatedUser = {
        id: 1,
        email: 'new@example.com',
        role: 'manager',
        password_hash: 'fakeHashedPassword',
        toJSON: () => ({ id: 1, email: 'new@example.com', password_hash: 'fakeHashedPassword' })
      };
      User.create.mockResolvedValue(fakeCreatedUser);

      // Act
      await createUser(req, res, next);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'fakeSalt');
      expect(User.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        password_hash: 'fakeHashedPassword',
        first_name: undefined,
        last_name: undefined,
        phone: undefined,
        role: 'manager',
        is_active: true
      });
      expect(successResponse).toHaveBeenCalledWith(
        res, 
        { id: 1, email: 'new@example.com' }, // password_hash should be removed
        'User created successfully', 
        201
      );
    });

    it('should return error if email is already taken', async () => {
      // Arrange
      req.body = { email: 'existing@example.com' };
      User.findOne.mockResolvedValue({ id: 2, email: 'existing@example.com' }); // User exists

      // Act
      await createUser(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'User already exists with this email', 400);
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user without password hash', async () => {
      // Arrange
      req.params = { id: 1 };
      req.body = { email: 'updated@example.com', password: 'newpassword' };
      
      const fakeUser = {
        id: 1,
        email: 'old@example.com',
        update: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: 1, email: 'updated@example.com', password_hash: 'newHashedPassword' })
      };
      
      User.findByPk.mockResolvedValue(fakeUser);
      bcrypt.genSalt.mockResolvedValue('newSalt');
      bcrypt.hash.mockResolvedValue('newHashedPassword');

      // Act
      await updateUser(req, res, next);

      // Assert
      expect(fakeUser.update).toHaveBeenCalledWith({
        email: 'updated@example.com',
        password_hash: 'newHashedPassword',
        first_name: undefined,
        last_name: undefined,
        phone: undefined,
        role: undefined,
        is_active: undefined
      });
      expect(successResponse).toHaveBeenCalledWith(res, { id: 1, email: 'updated@example.com' }, 'User updated successfully');
    });

    it('should return error 404 if user to update is not found', async () => {
      // Arrange
      req.params = { id: 888 };
      User.findByPk.mockResolvedValue(null);

      // Act
      await updateUser(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'User not found', 404);
    });
  });
});
