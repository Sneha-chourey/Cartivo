import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
} from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create order / Get all orders (admin)
router.route("/").post(protect, addOrderItems).get(protect, admin, getAllOrders);

// Get logged-in user's orders
router.get("/mine", protect, getMyOrders);

// Get order by ID
router.get("/:id", protect, getOrderById);

// Update order to paid (Razorpay webhook / client confirm)
router.put("/:id/pay", protect, updateOrderToPaid);

// Update order to delivered (admin only)
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;