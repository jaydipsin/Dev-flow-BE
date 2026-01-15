import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", authController.handleLogin);
router.post("/signup", authController.handleSignup);

// reset password

router.post("/reset-password", authController.handleresetPassword);
export default router;
