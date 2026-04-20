const { successResponse, errorResponse, paginatedResponse } = require('../../src/utils/response');

describe('Response Utilities', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('successResponse', () => {
    it('should send a successful JSON response with default message and status', () => {
      const data = { id: 1, name: 'Test' };
      successResponse(mockRes, data);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data,
      });
    });

    it('should send a successful JSON response with custom message and status', () => {
      const data = { id: 1 };
      successResponse(mockRes, data, 'Created', 201);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
        data,
      });
    });
  });

  describe('errorResponse', () => {
    it('should send an error JSON response with defaults', () => {
      errorResponse(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error',
        errors: null,
      });
    });

    it('should send an error JSON response with custom parameters', () => {
      errorResponse(mockRes, 'Validation Failed', 400, { field: 'email' });

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation Failed',
        errors: { field: 'email' },
      });
    });
  });

  describe('paginatedResponse', () => {
    it('should format a paginated response correctly', () => {
      const data = [1, 2, 3];
      paginatedResponse(mockRes, data, '2', '10', 25, 'Data loaded');

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Data loaded',
        data,
        pagination: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3, // Math.ceil(25 / 10)
        },
      });
    });
  });
});
