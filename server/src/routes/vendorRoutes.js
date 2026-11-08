
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getVendors,
  getVendorById,
  updateVendor,
  approveVendor,
  rejectVendor,
  toggleVendorStatus,
  deleteVendor,
} = require("../controllers/vendorAdminController");

// Admin vendor management
router.get("/", protect, authorizeRoles("admin"), getVendors);
router.get("/:id", protect, authorizeRoles("admin"), getVendorById);


router.put("/:id/approve", protect, authorizeRoles("admin"), approveVendor);
router.put("/:id/reject", protect, authorizeRoles("admin"), rejectVendor);
router.put("/:id/toggle-status", protect, authorizeRoles("admin"), toggleVendorStatus);

router.delete("/:id", protect, authorizeRoles("admin"), deleteVendor);

module.exports = router;
