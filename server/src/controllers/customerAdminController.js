const User = require("../models/User");

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    const filter = { role: "customer" };

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "blocked") {
      filter.isActive = false;
    }

    if (search.trim()) {
      filter.$or = [
        { fullName: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
        { phone: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const customers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

// GET SINGLE CUSTOMER
const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};

// BLOCK / UNBLOCK CUSTOMER
const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    return res.status(200).json({
      success: true,
      message: customer.isActive
        ? "Customer unblocked successfully"
        : "Customer blocked successfully",
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        isActive: customer.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle customer status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer status",
    });
  }
};

// PERMANENTLY DELETE CUSTOMER
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findOneAndDelete({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer permanently deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  toggleCustomerStatus,
  deleteCustomer,
};