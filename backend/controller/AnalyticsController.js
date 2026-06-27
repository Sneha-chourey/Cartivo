import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Payment from "../model/Payment.js";
import Analytics from "../model/Analytics.js";

// @desc    Get overall sales summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getDashboardSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });

    // Total revenue from paid orders only
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      totalOrders,
      paidOrders,
      deliveredOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get monthly revenue for a given year (for charts)
// @route   GET /api/analytics/revenue/monthly?year=2024
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const monthlyData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Fill in all 12 months (even if 0 revenue)
    const months = Array.from({ length: 12 }, (_, i) => {
      const found = monthlyData.find((d) => d._id.month === i + 1);
      return {
        month: i + 1,
        revenue: found ? parseFloat(found.revenue.toFixed(2)) : 0,
        orders: found ? found.orders : 0,
      };
    });

    res.json({ year, months });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/analytics/products/top?limit=5
// @access  Private/Admin
const getTopSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          unitsSold: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$orderItems.price", "$orderItems.quantity"],
            },
          },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: limit },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get revenue breakdown by category
// @route   GET /api/analytics/categories
// @access  Private/Admin
const getRevenueByCategory = async (req, res) => {
  try {
    const categoryData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          revenue: {
            $sum: {
              $multiply: ["$orderItems.price", "$orderItems.quantity"],
            },
          },
          unitsSold: { $sum: "$orderItems.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get new user registrations per month
// @route   GET /api/analytics/users/growth?year=2024
// @access  Private/Admin
const getUserGrowthStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const userData = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => {
      const found = userData.find((d) => d._id.month === i + 1);
      return {
        month: i + 1,
        newUsers: found ? found.newUsers : 0,
      };
    });

    res.json({ year, months });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get recent orders (last 10) for admin dashboard
// @route   GET /api/analytics/orders/recent
// @access  Private/Admin
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("user totalPrice isPaid isDelivered orderStatus createdAt");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get payment method breakdown
// @route   GET /api/analytics/payments/methods
// @access  Private/Admin
const getPaymentMethodStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getDashboardSummary,
  getSalesAnalytics,
  getTopSellingProducts,
  getRevenueByCategory,
  getUserGrowthStats,
  getRecentOrders,
  getPaymentMethodStats,
};