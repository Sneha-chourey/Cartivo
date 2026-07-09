import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { getCloudinary } from "../config/cloudinary.js";

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Update logged-in user profile (name, email)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      },
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Change logged-in user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Update user avatar/profile picture
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cartivo/avatars",
      resource_type: "image",
    });

    user.avatar = result.secure_url;
    await user.save();

    return res.status(200).json({
      message: "Avatar updated successfully",
      avatar: result.secure_url,
    });

  } catch (error) {
    console.error("Update Avatar Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: req.user._id });

    return res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};