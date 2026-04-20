const { login, getCurrentUser, logout } = require('../../src/controllers/auth.controller');
const { User } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Mock the response utilities to see what they were called with
jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
}));
const { successResponse, errorResponse } = require('../../src/utils/response');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup standard Express mock objects
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    
    // Set environment variable required for JWT
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('login', () => {
    it('should return error if user is not found', async () => {
      // 1. Arrange: User.findOne returns null (user not found)
      req.body = { email: 'nonexistent@example.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      // 2. Act
      await login(req, res, next);

      // 3. Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(errorResponse).toHaveBeenCalledWith(res, 'Invalid credentials', 401);
    });

    it('should return error if user is deactivated', async () => {
      // 1. Arrange
      req.body = { email: 'test@example.com', password: 'password123' };
      User.findOne.mockResolvedValue({ email: 'test@example.com', is_active: false });

      // 2. Act
      await login(req, res, next);

      // 3. Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'Your account has been deactivated', 403);
    });

    it('should return error if password is wrong', async () => {
      // 1. Arrange
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const fakeUser = { email: 'test@example.com', is_active: true, password_hash: 'hashedpassword' };
      
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(false); // Fake a failed password check

      // 2. Act
      await login(req, res, next);

      // 3. Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
      expect(errorResponse).toHaveBeenCalledWith(res, 'Invalid credentials', 401);
    });

    it('should returning success and token if credentials are valid', async () => {
      // 1. Arrange
      req.body = { email: 'test@example.com', password: 'correctpassword' };
      
      const fakeUser = { 
        id: 'user-id-123',
        email: 'test@example.com', 
        is_active: true, 
        password_hash: 'hashedpassword',
        update: jest.fn().mockResolvedValue(true), // Mock the update method
        toJSON: () => ({ id: 'user-id-123', email: 'test@example.com', password_hash: 'hashedpassword' }) // Mock the toJSON method
      };
      
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true); // Fake successful password check
      jwt.sign.mockReturnValue('fake-jwt-token'); // Fake JWT generation

      // 2. Act
      await login(req, res, next);

      // 3. Assert
      expect(fakeUser.update).toHaveBeenCalled(); // Should update last_login
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'user-id-123' }, 'test_secret', expect.any(Object));
      expect(successResponse).toHaveBeenCalledWith(
        res,
        {
          user: { id: 'user-id-123', email: 'test@example.com' }, // password_hash should be deleted
          token: 'fake-jwt-token'
        },
        'Login successful'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user profile successfully', async () => {
      // 1. Arrange
      req.user = { id: 'user-id-123' }; // Simulate logged-in user from middleware
      const fakeUser = { id: 'user-id-123', name: 'John Doe', email: 'john@example.com' };
      
      User.findByPk.mockResolvedValue(fakeUser);

      // 2. Act
      await getCurrentUser(req, res, next);

      // 3. Assert
      expect(User.findByPk).toHaveBeenCalledWith('user-id-123', expect.any(Object));
      expect(successResponse).toHaveBeenCalledWith(res, fakeUser, 'User retrieved successfully');
    });

    it('should call next() with error if database fails', async () => {
      // 1. Arrange
      req.user = { id: 'user-id-123' };
      const dbError = new Error('Database connection failed');
      User.findByPk.mockRejectedValue(dbError); // Simulate a DB crash

      // 2. Act
      await getCurrentUser(req, res, next);

      // 3. Assert
      expect(next).toHaveBeenCalledWith(dbError); // Express error handler should catch this
    });
  });

  describe('logout', () => {
    it('should return a logout successful message', async () => {
      // Act
      await logout(req, res, next);

      // Assert
      expect(successResponse).toHaveBeenCalledWith(res, null, 'Logout successful');
    });
  });
});
