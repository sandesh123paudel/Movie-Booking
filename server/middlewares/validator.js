import { body } from "express-validator";

export const registerValidator = () => {
  return [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

export const loginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

export const resetPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP Required")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP should be of 6 number"),

    body("newPassword")
      .notEmpty()
      .withMessage("New Password is required")
      .isLength({ min: 6 })
      .withMessage("New Password must be at least 6 characters long"),
  ];
};
