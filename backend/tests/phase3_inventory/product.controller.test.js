const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../../src/controllers/product.controller');
const { Product, Category } = require('../phase1_infrastructure/mocks/models');
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

describe('Product Controller', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  describe('getProducts', () => {
    it('should return paginated products successfully', async () => {
      // Arrange
      req.query = { page: 1, limit: 10 };
      const fakeData = {
        count: 2,
        rows: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]
      };
      Product.findAndCountAll.mockResolvedValue(fakeData);

      // Act
      await getProducts(req, res, next);

      // Assert
      expect(Product.findAndCountAll).toHaveBeenCalled();
      expect(paginatedResponse).toHaveBeenCalledWith(res, fakeData.rows, 1, 10, fakeData.count, 'Products retrieved successfully');
    });

    it('should call next with error if db fails', async () => {
      // Arrange
      const error = new Error('Database Error');
      Product.findAndCountAll.mockRejectedValue(error);

      // Act
      await getProducts(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getProduct', () => {
    it('should return a product successfully', async () => {
      // Arrange
      req.params = { id: 1 };
      const fakeProduct = { id: 1, name: 'Product 1' };
      Product.findByPk.mockResolvedValue(fakeProduct);

      // Act
      await getProduct(req, res, next);

      // Assert
      expect(Product.findByPk).toHaveBeenCalled();
      expect(successResponse).toHaveBeenCalledWith(res, fakeProduct, 'Product retrieved successfully');
    });

    it('should return 404 if product is not found', async () => {
      // Arrange
      req.params = { id: 999 };
      Product.findByPk.mockResolvedValue(null);

      // Act
      await getProduct(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'Product not found', 404);
    });
  });

  describe('createProduct', () => {
    it('should create and return the created product', async () => {
      // Arrange
      req.body = { name: 'New Product' };
      const fakeCreatedProduct = { id: 1, name: 'New Product' };
      const fakeProductWithCategory = { id: 1, name: 'New Product', category: { id: 1, name: 'Electronics' } };
      
      Product.create.mockResolvedValue(fakeCreatedProduct);
      Product.findByPk.mockResolvedValue(fakeProductWithCategory);

      // Act
      await createProduct(req, res, next);

      // Assert
      expect(Product.create).toHaveBeenCalledWith({ name: 'New Product' });
      expect(successResponse).toHaveBeenCalledWith(res, fakeProductWithCategory, 'Product created successfully', 201);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the updated product', async () => {
      // Arrange
      req.params = { id: 1 };
      req.body = { price: 99.99 };
      
      const fakeProduct = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      const fakeUpdatedProductWithCategory = { id: 1, price: 99.99, category: { name: 'Electronics'} };

      // The controller calls findByPk twice. Once to get the product, then to get it with Category included.
      Product.findByPk
        .mockResolvedValueOnce(fakeProduct)
        .mockResolvedValueOnce(fakeUpdatedProductWithCategory);

      // Act
      await updateProduct(req, res, next);

      // Assert
      expect(fakeProduct.update).toHaveBeenCalledWith({ price: 99.99 });
      expect(successResponse).toHaveBeenCalledWith(res, fakeUpdatedProductWithCategory, 'Product updated successfully');
    });

    it('should return 404 if product not found on update', async () => {
      // Arrange
      req.params = { id: 999 };
      Product.findByPk.mockResolvedValue(null);

      // Act
      await updateProduct(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'Product not found', 404);
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete the product', async () => {
      // Arrange
      req.params = { id: 1 };
      const fakeProduct = {
        id: 1,
        update: jest.fn().mockResolvedValue(true)
      };
      Product.findByPk.mockResolvedValue(fakeProduct);

      // Act
      await deleteProduct(req, res, next);

      // Assert
      expect(fakeProduct.update).toHaveBeenCalledWith({ is_active: false });
      expect(successResponse).toHaveBeenCalledWith(res, null, 'Product deleted successfully');
    });

    it('should return 404 if product not found on delete', async () => {
      // Arrange
      req.params = { id: 999 };
      Product.findByPk.mockResolvedValue(null);

      // Act
      await deleteProduct(req, res, next);

      // Assert
      expect(errorResponse).toHaveBeenCalledWith(res, 'Product not found', 404);
    });
  });
});
