import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
} from "../controller/productController.js";
import {protect} from "../middleware/authMiddleware.js";
import {admin} from "../middleware/adminMiddleware.js";
import multer from "multer";
import fs from "fs";
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

const router = express.Router();
router.use((req, res, next) => {
  console.log("PRODUCT ROUTE HIT:", req.method, req.url);
  next();
});


// Top rated products
router.get("/top", getTopProducts);

// All products
router
    .route("/")
    .get(getProducts)
    .post(protect, admin,upload.single('image') ,createProduct);

// Specific product by ID
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin,upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;