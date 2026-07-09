import User from "../model/User.js";

// @desc    Verify OTP sent to user's email
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Check OTP match
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiry (10 minutes)
    const otpAge = Date.now() - new Date(user.otpExpiry).getTime();
    if (otpAge > 10 * 60 * 1000) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark user as verified and clear OTP
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Resend OTP to user's email
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email
    const sendEmail = (await import("../utils/sendEmail.js")).default;
    await sendEmail(
      email,
      "Your New Cartivo OTP",
      `Hi ${user.name},\n\nYour new OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nTeam Cartivo`
    );

    return res.status(200).json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};