import express from "express";
import { registerUser,loginUser ,logoutUser } from "../controller/authController.js";
const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("users",protect, admin ,getUsers);
// router.post("/logout",logoutUser);
export default router;