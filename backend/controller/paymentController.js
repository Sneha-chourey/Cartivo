import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../model/Order.js";
import Payment from "../model/Payment.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    // Razorpay expects amount in paise
    const amountInPaise = Math.round(order.totalPrice * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Save payment record with status "created"
    const payment = new Payment({
      order: orderId,
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      status: "created",
    });

    await payment.save();

    res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // sent to frontend to init Razorpay checkout
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Step 1: Verify signature using HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      // Mark payment as failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed", failureReason: "Signature mismatch" }
      );
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Step 2: Update Payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Step 3: Mark Order as paid
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "paid",
      paidAt: Date.now(),
    };

    await order.save();

    res.json({ message: "Payment verified successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get payment details by order ID
// @route   GET /api/payments/:orderId
// @access  Private
const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      order: req.params.orderId,
    }).populate("order", "totalPrice orderStatus");

    if (!payment) {
      return res
        .status(404)
        .json({ message: "Payment not found for this order" });
    }

    // Only owner or admin can view
    if (
      payment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Refund a payment (admin only)
// @route   POST /api/payments/:orderId/refund
// @access  Private/Admin
const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "paid") {
      return res
        .status(400)
        .json({ message: "Only paid payments can be refunded" });
    }

    // Initiate refund via Razorpay
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: payment.amount, // full refund in paise
      notes: { reason: req.body.reason || "Requested by admin" },
    });

    payment.status = "refunded";
    payment.refundId = refund.id;
    payment.refundedAt = Date.now();
    await payment.save();

    res.json({ message: "Refund initiated successfully", refund });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentByOrder,
  refundPayment,
};