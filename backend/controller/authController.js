import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
};

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(Math.random() * 900000 + 100000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      otp,
      otpExpiry,
    });
    // newUser.save();
  


  const subject = "Verify Your Cartivo Account";

  const message = `Hi ${newUser.name},

Welcome to Cartivo! 🎉

Your email verification OTP is: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone.

If you did not create this account, you can safely ignore this email.

Thank you,
Team Cartivo
`;
// Wrap sendEmail to isolate the issue
try {
  await sendEmail(email, subject, message);
} catch (emailErr) {
  console.error("Email Error:", emailErr); // ← check your terminal for this
}
  const token = generateToken(newUser._id);

  return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });

    
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// ================= LOGIN USER =================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (user) {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
         
        },
         token,
      });

    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUsers = async(req,res)=>{
  try{
    const users = await User.find({}).select('-password');
    return res.status(200).json({
    users,
    });
  } catch (error) {
  console.error(error);
  return res.status(500).json({
    message: "Server Error",
  });
}
}
// ================= FORGOT PASSWORD (send OTP) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether the email exists — security best practice
      return res.status(200).json({
        message: "If that email exists, a reset OTP has been sent.",
      });
    }

    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const subject = "Reset Your Cartivo Password";
    const message = `Hi ${user.name},

You requested to reset your password.

Your OTP is: ${otp}

This OTP is valid for 10 minutes. If you didn't request this, ignore this email and your password will remain unchanged.

Team Cartivo`;

    try {
      await sendEmail(email, subject, message);
    } catch (emailErr) {
      console.error("Email Error:", emailErr);
    }

    return res.status(200).json({
      message: "If that email exists, a reset OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= RESET PASSWORD (verify OTP + set new password) =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No reset request found. Please request a new OTP." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};