const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  verifyEmail, 
  loginUser, 
  reportActivity, 
  forgotPassword, 
  resetPassword,
  getProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Inscription
router.post("/register", registerUser);

// Vérification email
router.get("/verify-email/:token", verifyEmail);

// Connexion
router.post("/login", loginUser);

// Signalement
router.get("/report-activity/:token", reportActivity);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

// 🔐 Route protégée
router.get("/profile", protect, getProfile);

module.exports = router;