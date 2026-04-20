const { getInventory, getInventoryByLocation, adjustInventory } = require('../../src/controllers/inventory.controller');
const { Inventory } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

// Mock dependencies
jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));

// Mock response utilities
jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
  paginatedResponse: jest.fn(),
}));
const { successResponse, errorResponse, paginatedResponse } = require('../../src/utils/response');

describe('Inventory Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getInventory', () => {
    it('should return paginated inventory successfully', async () => {
      // Arrange
      req.query = { page: 1, limit: 10, low_stock: 'false' };
      const fakeData = {
        count: 2,
        rows: [{ id: 1, quantity_available: 50 }, { id: 2, quantity_available: 20 }]
      };
      Inventory.findAndCountAll.mockResolvedValue(fakeData);

      // Act
      await getInventory(req, res, next);

      // Assert
      expect(Inventory.findAndCountAll).toHaveBeenCalled();
      expect(paginatedResponse).toHaveBeenCalledWith(res, fakeData.rows, 1, 10, fakeData.count, 'Inventory retrieved successfully');
    });

    it('should successfully filter low stock items', async () => {
      // Arrange
      req.query = { page: 1, limit: 10, low_stock: 'true' };
      const fakeData = {
        count: 2,
        rows: [
          { id: 1, quantity_available: 5, product: { reorder_point: 10 } }, // Low stock -> should be kept
          { id: 2, quantity_available: 50, product: { reorder_point: 10 } } // Normal -> should be filtered
        ]
      };
      Inventory.findAndCountAll.mockResolvedValue(fakeData);

      // Act
      await getInventory(req, res, next);

      // Assert
      const expectedFilteredRows = [fakeData.rows[0]]; // Only item 1
      expect(paginatedResponse).toHaveBeenCalledWith(res, expectedFilteredRows, 1, 10, fakeData.count, 'Inventory retrieved successfully');
    });
  });

  describe('getInventoryByLocation', () => {
    it('should return inventory for a specific location', async () => {
      // Arrange
      req.params = { locationId: 1 };
      const fakeInventory = [{ id: 1, quantity_available: 100 }];
      Inventory.findAll.mockResolvedValue(fakeInventory);

      // Act
      await getInventoryByLocation(req, res, next);

      // Assert
      expect(Inventory.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { location_id: 1 }
      }));
      expect(successResponse).toHaveBeenCalledWith(res, fakeInventory, 'Inventory retrieved successfully');
    });
  });

  describe('adjustInventory', () => {
    beforeEach(() => {
      req.user = { id: 99 }; // Logged in user doing the adjustment
      req.body = { product_id: 1, location_id: 1, quantity: 5, reason: 'Restock' };
    });

    it('should create new inventory record if none exists', async () => {
      // Arrange
      Inventory.findOne.mockResolvedValue(null);
      const fakeCreatedInventory = { id: 10, quantity_available: 5 };
      const fakeFetchedInventory = { id: 10, quantity_available: 5, product: {}, location: {} };
      
      Inventory.create.mockResolvedValue(fakeCreatedInventory);
      Inventory.findByPk.mockResolvedValue(fakeFetchedInventory);

      // Act
      await adjustInventory(req, res, next);

      // Assert
      expect(Inventory.create).toHaveBeenCalledWith({
        product_id: 1,
        location_id: 1,
        quantity_available: 5,
        last_adjustment_reason: 'Restock',
        updated_by: 99,
      });
      expect(successResponse).toHaveBeenCalledWith(res, fakeFetchedInventory, 'Inventory adjusted successfully');
    });

    it('should update existing inventory record', async () => {
      // Arrange
      const fakeInventoryItem = {
        id: 10,
        quantity_available: 20,
        update: jest.fn().mockResolvedValue(true)
      };
      const fakeFetchedInventory = { id: 10, quantity_available: 25, product: {}, location: {} };
      
      Inventory.findOne.mockResolvedValue(fakeInventoryItem);
      Inventory.findByPk.mockResolvedValue(fakeFetchedInventory);

      // Act - We add 5
      await adjustInventory(req, res, next);

      // Assert
      expect(fakeInventoryItem.update).toHaveBeenCalledWith({
        quantity_available: 25, // 20 + 5
        last_adjustment_reason: 'Restock',
        updated_by: 99,
      });
      expect(successResponse).toHaveBeenCalledWith(res, fakeFetchedInventory, 'Inventory adjusted successfully');
    });

    it('should return error 400 if reducing stock results in negative quantity', async () => {
      // Arrange
      req.body.quantity = -30; // Attempting to remove 30
      const fakeInventoryItem = {
        id: 10,
        quantity_available: 20, // Only 20 available
        update: jest.fn()
      };
      
      Inventory.findOne.mockResolvedValue(fakeInventoryItem);

      // Act
      await adjustInventory(req, res, next);

      // Assert
      expect(fakeInventoryItem.update).not.toHaveBeenCalled();
      expect(errorResponse).toHaveBeenCalledWith(res, 'Insufficient inventory', 400);
    });
  });
});
