module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define(
    'PurchaseOrder',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      po_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      supplier_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'suppliers',
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
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      expected_delivery_date: {
        type: DataTypes.DATEONLY,
      },
      actual_delivery_date: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'draft',
        validate: {
          isIn: [['draft', 'submitted', 'approved', 'ordered', 'partially_received', 'received', 'cancelled']],
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
      shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'purchase_orders',
      timestamps: true,
    }
  );

  return PurchaseOrder;
};
