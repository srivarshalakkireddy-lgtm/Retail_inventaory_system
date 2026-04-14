const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const Category = require('./Category')(sequelize, DataTypes);
const Location = require('./Location')(sequelize, DataTypes);
const Inventory = require('./Inventory')(sequelize, DataTypes);
const Customer = require('./Customer')(sequelize, DataTypes);
const SalesOrder = require('./SalesOrder')(sequelize, DataTypes);
const SalesOrderItem = require('./SalesOrderItem')(sequelize, DataTypes);
const Supplier = require('./Supplier')(sequelize, DataTypes);
const PurchaseOrder = require('./PurchaseOrder')(sequelize, DataTypes);

// Define associations
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

Inventory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Inventory.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
Product.hasMany(Inventory, { foreignKey: 'product_id', as: 'inventory' });
Location.hasMany(Inventory, { foreignKey: 'location_id', as: 'inventory' });

SalesOrder.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
SalesOrder.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
SalesOrder.hasMany(SalesOrderItem, { foreignKey: 'order_id', as: 'items' });
SalesOrderItem.belongsTo(SalesOrder, { foreignKey: 'order_id', as: 'order' });
SalesOrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
PurchaseOrder.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Location,
  Inventory,
  Customer,
  SalesOrder,
  SalesOrderItem,
  Supplier,
  PurchaseOrder,
};
