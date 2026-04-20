const { getDashboardStats } = require('../../src/controllers/report.controller');
const { Product, SalesOrder, Inventory, sequelize } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));

jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
}));
const { successResponse } = require('../../src/utils/response');

describe('Report Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getDashboardStats', () => {
    it('should return correct dashboard statistics', async () => {
      Product.count.mockResolvedValue(150);
      SalesOrder.count.mockResolvedValue(45);
      SalesOrder.sum.mockResolvedValue(12500.50);
      Inventory.count.mockResolvedValue(12); // 12 low stock items
      
      SalesOrder.findAll.mockResolvedValue([
        { status: 'pending', dataValues: { count: '10' } },
        { status: 'completed', dataValues: { count: '35' } }
      ]);
      
      sequelize.literal.mockReturnValue('literal-query');
      sequelize.fn.mockReturnValue('fn-query');
      sequelize.col.mockReturnValue('col-query');

      await getDashboardStats(req, res, next);

      expect(successResponse).toHaveBeenCalledWith(res, {
        totalProducts: 150,
        totalOrders: 45,
        totalRevenue: '12500.50',
        lowStockItems: 12,
        orderStatusCounts: [
          { status: 'pending', count: 10 },
          { status: 'completed', count: 35 }
        ]
      }, 'Dashboard stats retrieved successfully');
    });

    it('should call next with error if db fails', async () => {
      const err = new Error('DB Error');
      Product.count.mockRejectedValue(err);

      await getDashboardStats(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
