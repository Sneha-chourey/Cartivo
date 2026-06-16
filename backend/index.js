import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/analytics',analyticsRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});