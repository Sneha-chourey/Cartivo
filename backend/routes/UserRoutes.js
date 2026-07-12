import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateAvatar,
  deleteUserAccount,
} from "../controller/UserController.js";
import { forgotPassword, resetPassword } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";

// Create uploads folder if not exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });

const router = express.Router();

// Get & Update profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

// Change password
router.put("/change-password", protect, changePassword);

// Update avatar
router.put("/avatar", protect, upload.single("avatar"), updateAvatar);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;