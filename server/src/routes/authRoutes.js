const express = require("express");
const router = express.Router();

const {
  customerSignup,
  vendorSignup,
  login,
  vendorLogin,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Customer signup
router.post("/customer/signup", customerSignup);

// Vendor signup
router.post("/vendor/signup", vendorSignup);

// Common login for Admin and Customer
router.post("/login", login);

// Vendor login
router.post("/vendor/login", vendorLogin);

// Current authenticated user
router.get("/me", protect, getMe);

module.exports = router;
