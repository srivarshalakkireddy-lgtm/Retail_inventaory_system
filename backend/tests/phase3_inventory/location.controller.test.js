const { getLocations, getLocation } = require('../../src/controllers/location.controller');
const { Location } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

// Mock dependencies
jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));

// Mock response utilities
jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
}));
const { successResponse, errorResponse } = require('../../src/utils/response');

describe('Location Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getLocations', () => {
    it('should return all active locations successfully', async () => {
      // Arrange
      req.query = { is_active: 'true' };
      const fakeLocations = [
        { id: 1, name: 'Warehouse A', type: 'warehouse' },
        { id: 2, name: 'Store B', type: 'storefront' }
      ];
      Location.findAll.mockResolvedValue(fakeLocations);

      // Act
      await getLocations(req, res, next);

      // Assert
      expect(Location.findAll).toHaveBeenCalledWith({
        where: { is_active: true },
        order: [['name', 'ASC']]
      });
      expect(successResponse).toHaveBeenCalledWith(res, fakeLocations, 'Locations retrieved successfully');
    });

    it('should filter locations by type', async () => {
      // Arrange
      req.query = { type: 'warehouse', is_active: '' };
      Location.findAll.mockResolvedValue([]);

      // Act
      await getLocations(req, res, next);

      // Assert
      expect(Location.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { type: 'warehouse' }
      }));
    });

    it('should call next with error if db fails', async () => {
      // Arrange
      const err = new Error('DB Error');
      Location.findAll.mockRejectedValue(err);

      // Act
      await getLocations(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getLocation', () => {
    it('should return a specific location if found', async () => {
      // Arrange
      req.params = { id: 1 };
      const fakeLocation = { id: 1, name: 'Warehouse A' };
      Location.findByPk.mockResolvedValue(fakeLocation);

      // Act
      await getLocation(req, res, next);

      // Assert
      expect(Location.findByPk).toHaveBeenCalledWith(1);
      expect(successResponse).toHaveBeenCalledWith(res, fakeLocation, 'Location retrieved successfully');
    });

    it('should return 404 if location is not found', async () => {
      // Arrange
      req.params = { id: 999 };
      Location.findByPk.mockResolvedValue(null);

      // Act
      await getLocation(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'Location not found', 404);
    });
  });
});
