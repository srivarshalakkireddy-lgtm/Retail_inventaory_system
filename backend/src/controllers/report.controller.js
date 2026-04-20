const { sequelize, Product, SalesOrder, Inventory } = require('../models');
const { successResponse } = require('../utils/response');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/reports/dashboard
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // Parallelize queries to reduce latency from cross-region DB calls
    const [
      totalProducts,
      totalOrders,
      revenueResult,
      lowStockItems,
      orderStatusCounts
    ] = await Promise.all([
      Product.count({ where: { is_active: true } }),
      SalesOrder.count(),
      SalesOrder.sum('total_amount'),
      Inventory.count({
        include: [
          {
            model: Product,
            as: 'product',
            where: sequelize.literal('"Inventory"."quantity_available" <= "product"."reorder_point"'),
          },
        ],
      }),
      SalesOrder.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['status']
      })
    ]);

    const totalRevenue = revenueResult || 0;

    const stats = {
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue).toFixed(2),
      lowStockItems,
      orderStatusCounts: orderStatusCounts.map(s => ({
        status: s.status,
        count: parseInt(s.dataValues.count, 10)
      })),
    };

    successResponse(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
