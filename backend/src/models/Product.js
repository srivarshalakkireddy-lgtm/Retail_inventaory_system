module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: DataTypes.STRING(100),
      },
      rfid_tag: {
        type: DataTypes.STRING(100),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      category_id: {
        type: DataTypes.UUID,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      unit_of_measure: {
        type: DataTypes.STRING(20),
        defaultValue: 'piece',
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
      },
      dimensions: {
        type: DataTypes.JSONB,
      },
      min_stock_level: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      max_stock_level: {
        type: DataTypes.INTEGER,
      },
      reorder_point: {
        type: DataTypes.INTEGER,
      },
      reorder_quantity: {
        type: DataTypes.INTEGER,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};
