import { body } from "express-validator";

export const signUpValidator = [
  body("userName").notEmpty().withMessage("USername is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters")
    .matches(/[a-z]/)
    .withMessage("At least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("At least one uppercase letter")
    .matches(/\d/)
    .withMessage("At least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("At least one special character"),
];
