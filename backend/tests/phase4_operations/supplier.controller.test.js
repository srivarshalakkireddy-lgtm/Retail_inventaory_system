const { getSuppliers, getSupplier, createSupplier, updateSupplier } = require('../../src/controllers/supplier.controller');
const { Supplier } = require('../phase1_infrastructure/mocks/models');
const { mockRequest, mockResponse, mockNext } = require('../phase1_infrastructure/mocks/express');

jest.mock('../../src/models', () => require('../phase1_infrastructure/mocks/models'));

jest.mock('../../src/utils/response', () => ({
  successResponse: jest.fn(),
  errorResponse: jest.fn(),
  paginatedResponse: jest.fn(),
}));
const { successResponse, errorResponse, paginatedResponse } = require('../../src/utils/response');

describe('Supplier Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getSuppliers', () => {
    it('should return paginated suppliers successfully', async () => {
      req.query = { page: 1, limit: 10, is_active: 'true' };
      const fakeData = { count: 1, rows: [{ id: 1, name: 'Supplier A' }] };
      Supplier.findAndCountAll.mockResolvedValue(fakeData);

      await getSuppliers(req, res, next);

      expect(Supplier.findAndCountAll).toHaveBeenCalled();
      expect(paginatedResponse).toHaveBeenCalledWith(res, fakeData.rows, 1, 10, fakeData.count, 'Suppliers retrieved successfully');
    });

    it('should call next with error if db fails', async () => {
      const err = new Error('DB Error');
      Supplier.findAndCountAll.mockRejectedValue(err);

      await getSuppliers(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('getSupplier', () => {
    it('should return a supplier if found', async () => {
      req.params = { id: 1 };
      const fakeSupplier = { id: 1, name: 'Supplier A' };
      Supplier.findByPk.mockResolvedValue(fakeSupplier);

      await getSupplier(req, res, next);

      expect(successResponse).toHaveBeenCalledWith(res, fakeSupplier, 'Supplier retrieved successfully');
    });

    it('should return 404 if supplier not found', async () => {
      req.params = { id: 999 };
      Supplier.findByPk.mockResolvedValue(null);

      await getSupplier(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 'Supplier not found', 404);
    });
  });

  describe('createSupplier', () => {
    it('should create and return supplier', async () => {
      req.body = { name: 'Supplier A' };
      const fakeSupplier = { id: 1, name: 'Supplier A' };
      Supplier.create.mockResolvedValue(fakeSupplier);

      await createSupplier(req, res, next);

      expect(Supplier.create).toHaveBeenCalledWith({ name: 'Supplier A' });
      expect(successResponse).toHaveBeenCalledWith(res, fakeSupplier, 'Supplier created successfully', 201);
    });
  });

  describe('updateSupplier', () => {
    it('should update and return supplier', async () => {
      req.params = { id: 1 };
      req.body = { name: 'Updated Supplier' };
      const fakeSupplier = { id: 1, update: jest.fn().mockResolvedValue(true) };
      Supplier.findByPk.mockResolvedValue(fakeSupplier);

      await updateSupplier(req, res, next);

      expect(fakeSupplier.update).toHaveBeenCalledWith({ name: 'Updated Supplier' });
      expect(successResponse).toHaveBeenCalledWith(res, fakeSupplier, 'Supplier updated successfully');
    });

    it('should return 404 if not found', async () => {
      req.params = { id: 999 };
      Supplier.findByPk.mockResolvedValue(null);

      await updateSupplier(req, res, next);

      expect(errorResponse).toHaveBeenCalledWith(res, 'Supplier not found', 404);
    });
  });
});
