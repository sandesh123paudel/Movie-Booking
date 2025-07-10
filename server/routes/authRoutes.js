const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateUser");

// Registration and verification routes
authRouter.post("/register", validateRegister, authController.register);
authRouter.patch("/verify-email/:token", authController.verifyEmail);
authRouter.post(
  "/resend-verification-email",
  authController.sendVerificationEmail
);

//Login Routes
authRouter.post("/login", validateLogin, authController.login);

module.exports = authRouter;
