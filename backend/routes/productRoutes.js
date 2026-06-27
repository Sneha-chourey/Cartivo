import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
} from "../controller/productController.js";
import { protect } from "../middleware/authmiddleware.js";
import { admin } from "../middleware/adminmiddleware.js";
import multer from "multer";
const upload = multer({dest:'uploads/'});

const router = express.Router();

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