import express from "express";
import { registerUser,loginUser,getUsers} from "../controller/authController.js";
import {protect} from "../middleware/authmiddleware.js";
import { verifyOtp, resendOtp } from "../middleware/verifyOtp.js";
import {admin} from "../middleware/adminmiddleware.js";
const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/users",protect, admin ,getUsers);
// router.post("/logout",logoutUser);
export default router;