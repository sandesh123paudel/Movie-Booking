const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/authController");
const { validateRegister } = require("../middleware/validateUser");

// Registration and verification routes
authRouter.post("/register", validateRegister, authController.register);
authRouter.patch("/verify-email/:token", authController.verifyEmail);


module.exports = authRouter;
