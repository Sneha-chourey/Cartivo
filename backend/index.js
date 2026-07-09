import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config({ path: path.join(__dirname, ".env") });



import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 


connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Test Route
app.get("/", (req, res) => {
  res.send("Server is running ");
});
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/users', userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});