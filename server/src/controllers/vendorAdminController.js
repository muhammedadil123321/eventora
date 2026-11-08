
const Vendor = require("../models/Vendor");
const {
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
} = require("../utils/emailService");

// GET ALL VENDORS
const getVendors = async (req, res) => {
  try {
    const { status, category, search } = req.query;

    const filter = {
      isDeleted: { $ne: true },
    };

    if (status && status !== "all") {
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid vendor status filter",
        });
      }

      filter.approvalStatus = status;
    }

    if (category && category !== "all") {
      filter.serviceCategories = { $in: [category] };
    }

    if (search && search.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { businessName: regex },
        { fullName: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    const vendors = await Vendor.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("Get vendors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
    });
  }
};

// GET SINGLE VENDOR
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    }).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("Get vendor details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor details",
    });
  }
};



// APPROVE VENDOR
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const wasApproved = vendor.approvalStatus === "approved";

    if (!wasApproved) {
      vendor.approvalStatus = "approved";
      vendor.isActive = true;

      // Allow a fresh approval email after re-approval.
      vendor.approvalEmailSent = false;
      vendor.approvalEmailSentAt = null;

      await vendor.save();
    }

    let emailSent = vendor.approvalEmailSent === true;

    if (!emailSent) {
      try {
        const clientUrl =
          process.env.CLIENT_URL || "http://localhost:5173";

        const emailResult = await sendVendorApprovalEmail({
          vendorEmail: vendor.email,
          vendorName: vendor.fullName,
          loginUrl: `${clientUrl}/vendor/login`,
        });

        if (emailResult?.success) {
          vendor.approvalEmailSent = true;
          vendor.approvalEmailSentAt = new Date();
          await vendor.save();
          emailSent = true;
        }
      } catch (emailError) {
        console.error("Approval email error:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Vendor approved and approval email sent successfully."
        : "Vendor approved, but email was not sent. You can retry.",
      emailSent,
      vendor: {
        id: vendor._id,
        fullName: vendor.fullName,
        email: vendor.email,
        approvalStatus: vendor.approvalStatus,
        isActive: vendor.isActive,
      },
    });
  } catch (error) {
    console.error("Approve vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve vendor",
    });
  }
};

// REJECT VENDOR
const rejectVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.approvalStatus !== "rejected") {
      vendor.approvalStatus = "rejected";
      vendor.isActive = false;

      // Allow a fresh rejection email after a later re-rejection.
      vendor.rejectionEmailSent = false;
      vendor.rejectionEmailSentAt = null;

      await vendor.save();
    }

    let emailSent = vendor.rejectionEmailSent === true;

    if (!emailSent) {
      try {
        const emailResult = await sendVendorRejectionEmail({
          vendorEmail: vendor.email,
          vendorName: vendor.fullName,
        });

        if (emailResult?.success) {
          vendor.rejectionEmailSent = true;
          vendor.rejectionEmailSentAt = new Date();
          await vendor.save();
          emailSent = true;
        }
      } catch (emailError) {
        console.error("Rejection email error:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Vendor rejected and rejection email sent successfully."
        : "Vendor rejected, but email was not sent. You can retry.",
      emailSent,
      vendor: {
        id: vendor._id,
        fullName: vendor.fullName,
        email: vendor.email,
        approvalStatus: vendor.approvalStatus,
        isActive: vendor.isActive,
      },
    });
  } catch (error) {
    console.error("Reject vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject vendor",
    });
  }
};

// BLOCK / UNBLOCK VENDOR
const toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.approvalStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved vendors can be blocked or unblocked.",
      });
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: vendor.isActive
        ? "Vendor unblocked successfully"
        : "Vendor blocked successfully",
      vendor: {
        id: vendor._id,
        isActive: vendor.isActive,
        approvalStatus: vendor.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Toggle vendor status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update vendor status",
    });
  }
};


// PERMANENTLY DELETE VENDOR
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Permanently delete vendor document
    await Vendor.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Vendor permanently deleted successfully.",
    });
  } catch (error) {
    console.error("Delete vendor error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
    });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  toggleVendorStatus,
  deleteVendor,
};
