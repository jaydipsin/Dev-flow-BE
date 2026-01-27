import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as refreshController from "../controllers/refresh.controller.js";
import { signUpValidator } from "../shared/validators.js";
import { handleValidation } from "../middleware/validator.middleware.js";

const router = express.Router();

router.post("/login", authController.handleLogin);
router.post(
  "/signup",
  signUpValidator,
  handleValidation,
  authController.handleSignup,
);

// reset password

router.post("/reset-password", authController.handleresetPassword);

// Refresh
router.post("/refresh", refreshController.handleRefresh);

// Logout
router.post("/logout", authController.handleLogOut);
export default router;
