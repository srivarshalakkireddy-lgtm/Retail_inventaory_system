module.exports = (sequelize, DataTypes) => {
  const SalesOrderItem = sequelize.define(
    'SalesOrderItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sales_orders',
          key: 'id',
        },
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_percent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      tax_percent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      total_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      quantity_picked: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      quantity_shipped: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'sales_order_items',
      timestamps: true,
    }
  );

  return SalesOrderItem;
};
