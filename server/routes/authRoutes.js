import express from "express";
import {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from "../middlewares/validator.js";
import {
  isAuthenticated,
  login,
  logout,
  register,
  sendResetCode,
  sendVerificationCode,
  verifyEmail,
  verifyResetCode,
} from "../controller/authController.js";
import userAuth from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator(), register);
authRouter.post("/login", loginValidator(), login);
authRouter.post("/send-verification-email", userAuth, sendVerificationCode);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-passwordReset-email", sendResetCode);
authRouter.post("/reset-password", resetPasswordValidator(), verifyResetCode);
authRouter.post("/logout", logout);

export default authRouter;
