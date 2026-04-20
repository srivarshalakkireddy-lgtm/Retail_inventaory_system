const { protect, authorize } = require('../../src/middleware/auth');
const jwt = require('jsonwebtoken');
const { User } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    process.env.JWT_SECRET = 'secret';
  });

  describe('protect', () => {
    it('should call next if token is valid and user exists', async () => {
      req.headers.authorization = 'Bearer validtoken';
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue({ id: 1, is_active: true });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'secret');
      expect(User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(req.user).toEqual({ id: 1, is_active: true });
      expect(next).toHaveBeenCalled();
    });

    it('should block if no token provided', async () => {
      req.headers.authorization = undefined;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, no token provided' }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should block if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      jwt.verify.mockImplementation(() => { throw new Error('Invalid Token'); });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should block if user is inactive', async () => {
      req.headers.authorization = 'Bearer validtoken';
      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue({ id: 1, is_active: false });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'User account is inactive' }));
    });
  });

  describe('authorize', () => {
    it('should allow access if user has required role', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin', 'manager');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should block access if user lacks required role', () => {
      req.user = { role: 'staff' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should block access if req.user is missing (safety check)', () => {
      req.user = undefined;
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
