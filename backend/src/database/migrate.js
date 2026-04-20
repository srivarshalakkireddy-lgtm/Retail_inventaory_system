const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

const migrate = async () => {
  try {
    console.log('🚀 Starting database migration...');
    
    // Path to the schema file
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // List of tables to drop (in reverse order of dependencies)
    const tablesToDrop = [
      'audit_log',
      'sales_order_items',
      'sales_orders',
      'customers',
      'purchase_order_items',
      'purchase_orders',
      'supplier_products',
      'suppliers',
      'stock_transfer_items',
      'stock_transfers',
      'stock_adjustments',
      'inventory_transactions',
      'inventory',
      'product_images',
      'products',
      'categories',
      'locations',
      'user_sessions',
      'roles',
      'users'
    ];

    const viewsToDrop = [
      'v_low_stock_alert',
      'v_sales_order_summary',
      'v_current_inventory'
    ];

    // Execute the SQL
    await sequelize.transaction(async (t) => {
      console.log('🧹 Cleaning up existing tables/views...');
      
      for (const view of viewsToDrop) {
        await sequelize.query(`DROP VIEW IF EXISTS ${view} CASCADE;`, { transaction: t, logging: false });
      }

      for (const table of tablesToDrop) {
        await sequelize.query(`DROP TABLE IF EXISTS ${table} CASCADE;`, { transaction: t, logging: false });
      }

      console.log('📝 Applying schema...');
      // Disable logging for this large query to avoid console truncation
      await sequelize.query(schemaSql, { 
        transaction: t,
        raw: true,
        logging: false
      });
    });

    console.log('✅ Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database migration failed!');
    if (error.original) {
      console.error('Original Error:', error.original.message);
      console.error('SQL State:', error.original.code);
      console.error('Detail:', error.original.detail);
    } else {
      console.error('Error Message:', error.message);
    }
    process.exit(1);
  }
};

migrate();
