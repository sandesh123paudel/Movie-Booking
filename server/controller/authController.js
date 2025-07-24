import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_MESSAGE_TEMPLATE,
} from "../config/emailTemplate.js";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

//Google SignIN
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified",
      });
    }

    // Check if user already exists
    let user = await userModel.findOne({ email });

    if (user) {
      // User exists, update fields if necessary and then log them in
      let shouldUpdate = false;

      // Update full name if it's different and provided by Google
      if (name && user.fullName !== name) {
        user.fullName = name;
        shouldUpdate = true;
      }
      // Update googleId if missing
      if (!user.googleId) {
        user.googleId = googleId;
        shouldUpdate = true;
      }
      // Update profile picture if missing and provided by Google
      if (picture && !user.profilePicture) {
        user.profilePicture = picture;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        await user.save();
      }

      // Generate JWT token and set cookie for the existing user
      const jwtToken = generateToken(user._id);
      setTokenCookie(res, jwtToken);

      return res.json({
        success: true,
        message: "Logged in successfully with Google",
      });
    } else {
      // Create new user with Google data if email does not exist
      user = new userModel({
        fullName: name,
        email: email,
        googleId: googleId,
        profilePicture: picture,
        isVerified: true, // Google accounts are pre-verified
        // No password needed for Google users
      });

      await user.save();

      // Send welcome email for new Google users
      const mailOptions = {
        from: `"Quick Show-Movie Booking" <${process.env.EMAIL_ADDRESS}>`,
        to: user.email,
        subject: "Welcome to QuickShow",
        html: WELCOME_MESSAGE_TEMPLATE.replace("{{email}}", user.email)
          .replace("{{name}}", user.fullName)
          .replace("{{current_year}}", new Date().getFullYear()),
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.log("Welcome email failed:", emailError.message);
        // Don't fail the registration if email fails
      }

      // Generate JWT token and set cookie for new users
      const jwtToken = generateToken(user._id);
      setTokenCookie(res, jwtToken);

      return res.json({
        success: true,
        message: "Account created and logged in successfully with Google",
      });
    }
  } catch (error) {
    console.error("Google auth error:", error);

    if (
      error.message.includes("Token used too early") ||
      error.message.includes("Invalid token")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};
//Create  an admin
export const createAdminUser = async (req, res) => {
  const admin = await userModel.findOne({ email: "admin@quickshow.com" });
  if (admin) {
    return res.json({
      success: false,
      mesage: "Admin with this email already exists",
    });
  }
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = new userModel({
    fullName: "Quickshow Admin",
    email: "admin@quickshow.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });
  await adminUser.save();
  return res.json({
    success: true,
    mesage: "Admin created successfully",
  });
};

//Registraion API
export const register = async (req, res) => {
  //Check the validation using express validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ fullName, email, password: hashedPassword });

    const mailOptions = {
      from: `"Quick Show-Movie Booking" <${process.env.EMAIL_ADDRESS}>`,
      to: user.email,
      subject: "Welcome to QuickShow",
      html: WELCOME_MESSAGE_TEMPLATE.replace("{{email}}", user.email)
        .replace("{{name}}", user.fullName)
        .replace("{{current_year}}", new Date().getFullYear()),
    };
    await transporter.sendMail(mailOptions);
    await user.save();

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Login API
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.json({ success: false, message: "Invalid User or Password" });
    }

    // --- START: Added logic to handle Google-registered users ---
    // If the user has a googleId, it means they registered via Google.
    // They should use Google Sign-In, not email/password.
    if (existingUser.googleId) {
      return res.json({
        success: false,
        message:
          "This account was registered with Google. Please sign in with Google.",
      });
    }
    // --- END: Added logic to handle Google-registered users ---

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid User or Password" });
    }

    const token = generateToken(existingUser._id);
    setTokenCookie(res, token);

    return res.json({ success: true, message: "User LoggedIn successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send Veriy Email
export const sendVerificationCode = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.isVerified) {
      return res.json({ success: false, message: "User Already Verified" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const mailOptions = {
      from: `"VERIFY-ACCOUNT" <${process.env.EMAIL_ADDRESS}>`,

      to: user.email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOptions);
    await user.save();
    return res.json({
      success: true,
      message: "Verification Code has been successfully sent to the email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Validate Email Verify Code
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found " });
    }
    if (user.isVerified) {
      return res.json({ success: false, message: "User Already Verified" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;
    await user.save();
    return res.json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Check if the user is authenticated or not
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send Password Reset Code
export const sendResetCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.json({
      success: false,
      message: "Email is Required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // Changed to 6 digits for consistency
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const mailOptions = {
      from: `"RESET-PASSWORD" <${process.env.EMAIL_ADDRESS}>`,

      to: user.email,
      subject: "Password Reset OTP", // Changed subject for clarity
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOptions);
    await user.save();
    return res.json({
      success: true,
      message: "Password Reset Code has been successfully sent to the email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//Validate Password reset code and change password
export const verifyResetCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return res.status(400).json({ success: false, message: firstError });
  }
  const { email, otp, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" }); // Changed message for clarity
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Password Has Been Reset Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.userId; // from your auth middleware

    if (userId) {
      // Optional: Log the logout activity or update last logout time
      const user = await userModel.findById(userId);
      if (user) {
        // You could add a lastLogout field to track activity
        // user.lastLogout = new Date();
        // await user.save();
        console.log(`User ${user.email} logged out`);
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, message: "Logged Out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
