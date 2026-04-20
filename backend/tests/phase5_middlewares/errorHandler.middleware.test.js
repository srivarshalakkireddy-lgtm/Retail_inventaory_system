const errorHandler = require('../../src/middleware/errorHandler');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

jest.mock('../../src/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
    process.env.NODE_ENV = 'production';
  });

  it('should handle native SequelizeValidationError', () => {
    const error = {
      name: 'SequelizeValidationError',
      errors: [{ path: 'email', message: 'Email cannot be null' }]
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation error',
      errors: [{ field: 'email', message: 'Email cannot be null' }]
    });
  });

  it('should handle SequelizeUniqueConstraintError', () => {
    const error = {
      name: 'SequelizeUniqueConstraintError',
      errors: [{ path: 'email', message: 'Email must be unique' }]
    };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Duplicate entry'
    }));
  });

  it('should handle JsonWebTokenError', () => {
    const error = { name: 'JsonWebTokenError' };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid token' }));
  });

  it('should handle TokenExpiredError', () => {
    const error = { name: 'TokenExpiredError' };

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Token expired' }));
  });

  it('should handle generic errors', () => {
    const error = new Error('Something went terribly wrong');
    error.statusCode = 502; // Custom status

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went terribly wrong'
    });
  });
});
