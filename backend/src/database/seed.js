const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Path to the seed file
    const seedPath = path.join(__dirname, '../../../database/seed.sql');
    
    if (!fs.existsSync(seedPath)) {
      throw new Error(`Seed file not found at ${seedPath}`);
    }

    const seedSql = fs.readFileSync(seedPath, 'utf8');

    // Execute the SQL
    await sequelize.transaction(async (t) => {
      await sequelize.query(seedSql, { 
        transaction: t,
        raw: true 
      });
    });

    console.log('✅ Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seed();
