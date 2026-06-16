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
    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      otp,
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