/**
 * Helper file to mock Sequelize Models
 * This intercepts any database calls our controllers make and returns fake data instead,
 * ensuring our unit tests are fast and isolated from the database.
 */

const mockUser = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAndCountAll: jest.fn(),
  destroy: jest.fn(),
};

const mockProduct = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAndCountAll: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn(),
};

const mockCategory = {
  // simple mock for association includes
};

const mockInventory = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAndCountAll: jest.fn(),
  count: jest.fn(),
};

const mockLocation = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

const mockCustomer = {};
const mockSupplier = {
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockSalesOrder = {
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
  sum: jest.fn(),
  findAll: jest.fn(),
};

const mockSalesOrderItem = {
  bulkCreate: jest.fn(),
};

const mockSequelize = {
  literal: jest.fn(),
  fn: jest.fn(),
  col: jest.fn(),
};

module.exports = {
  sequelize: mockSequelize,
  User: mockUser,
  Product: mockProduct,
  Category: mockCategory,
  Inventory: mockInventory,
  Location: mockLocation,
  Customer: mockCustomer,
  Supplier: mockSupplier,
  SalesOrder: mockSalesOrder,
  SalesOrderItem: mockSalesOrderItem,
};
