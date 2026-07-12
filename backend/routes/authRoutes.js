import express from "express";

import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  getProfile,
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register Admin
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Logout
router.post("/logout", logoutAdmin);

// Refresh Access Token
router.post("/refresh-token", refreshAccessToken);

// Admin Profile
router.get("/profile", verifyToken, getProfile);

export default router;