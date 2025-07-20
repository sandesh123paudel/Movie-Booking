import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import { WELCOME_MESSAGE_TEMPLATE } from "../config/emailTemplate.js";
import { validationResult } from "express-validator";

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
    maxAge: 7 * 24 * 60 * 60 * 1000, //
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

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

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
    const isMatch = bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid User or Password" });
    }

    const token = generateToken(existingUser._id);
    setTokenCookie(res, token);

    res.json({ success: true, message: "User LoggedIn successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
