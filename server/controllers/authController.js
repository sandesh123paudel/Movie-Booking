const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Regular user registration
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    // If user exists, return early with error
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // If we get here, user doesn't exist, so create new user
    // Note: role is forcefully set to "user" for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with role explicitly set to "user"
    const savedUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // Force role to be "user" for regular registration
    });

    // Generate token
    const token = generateToken(savedUser._id);

    // Remove password from response
    savedUser.password = undefined;

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        role: savedUser.role,
        email: savedUser.email,
        token,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error("Registration error:", error);

    // Return error response
    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

