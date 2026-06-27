import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Razorpay IDs
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true, // stored in paise (₹1 = 100 paise)
    },
    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },

    method: {
      type: String, // upi, card, netbanking, wallet, etc. — filled after payment
      default: null,
    },

    failureReason: {
      type: String,
      default: null,
    },

    refundId: {
      type: String,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;