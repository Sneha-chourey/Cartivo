import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get Razorpay publishable key (safe to expose)
router.get("/razorpay-key", protect, getRazorpayKey);

// Create a new Razorpay order
router.post("/razorpay/create-order", protect, createRazorpayOrder);

// Verify Razorpay payment signature after client-side payment
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

export default router;