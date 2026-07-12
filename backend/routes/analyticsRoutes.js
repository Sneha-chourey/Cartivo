import express from "express";
import {
  getSalesAnalytics,
  getTopSellingProducts,
  getUserGrowthStats,
  getRevenueByCategory,
  getDashboardSummary,
  getRecentOrders
} from "../controller/AnalyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All analytics routes are admin-only

// Dashboard summary: total sales, orders, users, revenue
router.get("/summary", protect, admin, getDashboardSummary);

// Sales over time (daily/weekly/monthly)
router.get("/sales", protect, admin, getSalesAnalytics);

// Top selling products
router.get("/top-products", protect, admin, getTopSellingProducts);

// User growth over time
router.get("/user-growth", protect, admin, getUserGrowthStats);

// Revenue broken down by product category
router.get("/revenue-by-category", protect, admin, getRevenueByCategory);
router.get("/orders/recent", protect, admin, getRecentOrders);
export default router;