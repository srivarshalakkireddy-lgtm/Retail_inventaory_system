module.exports = (sequelize, DataTypes) => {
  const SalesOrder = sequelize.define(
    'SalesOrder',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: DataTypes.UUID,
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      location_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id',
        },
      },
      order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      required_date: {
        type: DataTypes.DATEONLY,
      },
      shipped_date: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'confirmed', 'processing', 'picked', 'packed', 'shipped', 'delivered', 'cancelled']],
        },
      },
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'unpaid',
        validate: {
          isIn: [['unpaid', 'partially_paid', 'paid', 'refunded']],
        },
      },
      shipping_address: {
        type: DataTypes.TEXT,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'sales_orders',
      timestamps: true,
    }
  );

  return SalesOrder;
};
