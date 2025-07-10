const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../middleware/sendMail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register Controller
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    // Generate verification token after user creation
    const verificationToken = await newUser.generateVerificationToken(); // Added await
    await newUser.save();

    console.log("Verification token generated:", verificationToken); // Debug log

    // Send verification email
    const emailSent = await sendVerificationEmail(
      newUser.email,
      verificationToken
    );

    console.log("Email sent status:", emailSent); // Debug log

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Remove password from response
    newUser.password = undefined;

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "User registered successfully. Please check your email to verify your account."
        : "User registered successfully, but failed to send verification email. Please request a new verification email.",
      emailSent,
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Send Verification Email Controller
exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const verificationToken = await user.generateVerificationToken(); // Added await
    await user.save();

    const emailSent = await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Verification email sent successfully"
        : "Failed to send verification email",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during email verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verify Email Controller
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during email verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Find user and explicitly select the password field
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!existingUser.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = generateToken(existingUser._id);

    // Remove password from response
    existingUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        isEmailVerified: existingUser.isEmailVerified,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
