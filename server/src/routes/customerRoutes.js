const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomerById,
  toggleCustomerStatus,
  deleteCustomer,
} = require("../controllers/customerAdminController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin only
router.use(protect, roleMiddleware("admin"));

// GET ALL CUSTOMERS
router.get("/", getCustomers);

// GET SINGLE CUSTOMER
router.get("/:id", getCustomerById);

// BLOCK / UNBLOCK CUSTOMER
router.put("/:id/toggle-status", toggleCustomerStatus);

// PERMANENT DELETE CUSTOMER
router.delete("/:id", deleteCustomer);

module.exports = router;