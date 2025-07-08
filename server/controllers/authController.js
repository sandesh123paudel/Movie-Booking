const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.register = async (req, res) => {
  try {
    // Get user data from request body
    const { fullName, email, password } = req.body;

    // Check existingg user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(savedUser._id);

    savedUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        token,
      },
    });
  } catch (error) {
    // Internal server error
    res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};
