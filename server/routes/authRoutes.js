const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/authController");
const { validateRegister } = require("../middleware/validateUser");

authRouter.post("/register", validateRegister, authController.register);

module.exports = authRouter;
