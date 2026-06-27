import mongoose from "mongoose";

// Daily snapshot of key metrics — one document per day
const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // one snapshot per day
    },

    // Revenue
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },

    // Orders breakdown
    paidOrders: { type: Number, default: 0 },
    deliveredOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },

    // Users
    newUsers: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },

    // Top selling products (array of { productId, name, unitsSold, revenue })
    topProducts: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        unitsSold: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
      },
    ],

    // Category breakdown
    categoryRevenue: [
      {
        category: { type: String },
        revenue: { type: Number, default: 0 },
        unitsSold: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;