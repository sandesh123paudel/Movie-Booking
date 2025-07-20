import express from "express";
import { loginValidator, registerValidator } from "../middlewares/validator.js";
import { login, register } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator(), register);
authRouter.post("/login", loginValidator(), login);
export default authRouter;
