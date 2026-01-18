import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as refreshController from "../controllers/refresh.controller.js";

const router = express.Router();

router.post("/login", authController.handleLogin);
router.post("/signup", authController.handleSignup);

// reset password

router.post("/reset-password", authController.handleresetPassword);

// Refresh
router.post("/refresh", refreshController.handleRefresh);

// Logout
router.post("/logout", authController.handleLogOut);
export default router;
