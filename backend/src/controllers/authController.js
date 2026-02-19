// src/controllers/authController.js

const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

/**
 * Generate JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

/**
 * Register Controller
 */
const SELF_ASSIGNABLE_ROLES = ["USER", "APPROVER"];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (role && !SELF_ASSIGNABLE_ROLES.includes(role)) {
      return res.status(403).json({ message: "Cannot self-assign this role" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    const isDev = process.env.NODE_ENV === "development";
    res.status(500).json({
      message: "Server error",
      error: isDev ? error.message : undefined,
    });
  }
};

/**
 * Login Controller
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
};
