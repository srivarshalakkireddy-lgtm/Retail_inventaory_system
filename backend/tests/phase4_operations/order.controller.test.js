const { getOrders, getOrder, createOrder, updateOrderStatus } = require('../../src/controllers/order.controller');
const { SalesOrder, SalesOrderItem } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));

jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
  paginatedResponse: jest.fn(),
}));
const { successResponse, errorResponse, paginatedResponse } = require('../../src/utils/response');

describe('Order Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getOrders', () => {
    it('should return paginated orders successfully', async () => {
      req.query = { page: 1, limit: 10, status: 'pending' };
      const fakeData = { count: 1, rows: [{ id: 1, order_number: 'SO-2026-0001' }] };
      SalesOrder.findAndCountAll.mockResolvedValue(fakeData);

      await getOrders(req, res, next);

      expect(SalesOrder.findAndCountAll).toHaveBeenCalled();
      expect(paginatedResponse).toHaveBeenCalledWith(res, fakeData.rows, 1, 10, fakeData.count, 'Orders retrieved successfully');
    });

    it('should pass error to next middleware', async () => {
      const err = new Error('DB Error');
      SalesOrder.findAndCountAll.mockRejectedValue(err);

      await getOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getOrder', () => {
    it('should return a single order successfully', async () => {
      req.params = { id: 1 };
      const fakeOrder = { id: 1 };
      SalesOrder.findByPk.mockResolvedValue(fakeOrder);

      await getOrder(req, res, next);

      expect(SalesOrder.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(successResponse).toHaveBeenCalledWith(res, fakeOrder, 'Order retrieved successfully');
    });

    it('should return 404 if order is not found', async () => {
      req.params = { id: 999 };
      SalesOrder.findByPk.mockResolvedValue(null);

      await getOrder(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 'Order not found', 404);
    });
  });

  describe('createOrder', () => {
    it('should create an order with items and calculate correct totals', async () => {
      req.body = {
        customer_id: 1,
        location_id: 1,
        shipping_cost: 10,
        items: [
          { product_id: 1, quantity: 2, unit_price: 100 }, // 200
          { product_id: 2, quantity: 1, unit_price: 50 },  // 50
        ]
        // subtotal = 250
        // tax (9%) = 22.5
        // total (subtotal + tax + shipping_cost) = 250 + 22.5 + 10 = 282.5
      };

      SalesOrder.count.mockResolvedValue(5); // So order number is SO-yyyy-0006
      const fakeCreatedOrder = { id: 10 };
      const fakeFullOrder = { id: 10, items: [] };

      SalesOrder.create.mockResolvedValue(fakeCreatedOrder);
      SalesOrderItem.bulkCreate.mockResolvedValue(true);
      SalesOrder.findByPk.mockResolvedValue(fakeFullOrder);

      await createOrder(req, res, next);

      expect(SalesOrder.create).toHaveBeenCalledWith(expect.objectContaining({
        order_number: expect.stringMatching(/SO-\d{4}-0006/),
        customer_id: 1,
        location_id: 1,
        subtotal: 250,
        tax_amount: 22.5,
        total_amount: 282.5,
      }));

      expect(SalesOrderItem.bulkCreate).toHaveBeenCalledWith([
        { order_id: 10, product_id: 1, quantity: 2, unit_price: 100, total_price: 200 },
        { order_id: 10, product_id: 2, quantity: 1, unit_price: 50, total_price: 50 },
      ]);

      expect(successResponse).toHaveBeenCalledWith(res, fakeFullOrder, 'Order created successfully', 201);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the order status securely', async () => {
      req.params = { id: 1 };
      req.body = { status: 'shipped' };
      const fakeOrder = { id: 1, update: jest.fn().mockResolvedValue(true) };
      
      SalesOrder.findByPk.mockResolvedValue(fakeOrder);

      await updateOrderStatus(req, res, next);

      expect(fakeOrder.update).toHaveBeenCalledWith({ status: 'shipped' });
      expect(successResponse).toHaveBeenCalledWith(res, fakeOrder, 'Order status updated successfully');
    });

    it('should return 404 if order not found for status update', async () => {
      req.params = { id: 999 };
      SalesOrder.findByPk.mockResolvedValue(null);

      await updateOrderStatus(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 'Order not found', 404);
    });
  });
});
