const User = require("../models/User");
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Safe User Response
const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
});

const isValidEmail = (email) => {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
};

// CUSTOMER SIGNUP
const customerSignup = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUser, existingVendor] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      Vendor.findOne({ email: normalizedEmail }),
    ]);

    if (existingUser || existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      role: "customer",
    });

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Customer account created successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Customer signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Customer signup failed",
    });
  }
};

// VENDOR SIGNUP — SAVE DIRECTLY IN VENDOR COLLECTION
const vendorSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      businessName,
      address,
      experience,
      categories,
      serviceCategories,
      services,
    } = req.body;

    const chosenCategories = categories || serviceCategories;

    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !businessName ||
      !address ||
      !Array.isArray(chosenCategories) ||
      chosenCategories.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required vendor details and at least one service category",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUser, existingVendor] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      Vendor.findOne({ email: normalizedEmail }),
    ]);

    if (existingUser || existingVendor) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered or has an existing vendor application.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let formattedServices = [];

    if (Array.isArray(services) && services.length > 0) {
      formattedServices = services.map((service) => ({
        name: service.name || service.serviceName,
        pricingType: service.pricingType || "duration",
        rates:
          service.rates ||
          (service.fixedPrice
            ? { hourly: Number(service.fixedPrice) }
            : {}),
      }));
    } else {
      formattedServices = [
        {
          name: chosenCategories[0] || "General Service",
          pricingType: "duration",
          rates: { fullDay: 0 },
        },
      ];
    }

    const vendor = await Vendor.create({
      fullName: String(fullName).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      businessName: String(businessName).trim(),
      address: String(address).trim(),
      experience: Number(experience) || 0,
      serviceCategories: chosenCategories,
      services: formattedServices,
      approvalStatus: "pending",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor registration submitted. Waiting for Admin approval.",
      vendor: {
        id: vendor._id,
        fullName: vendor.fullName,
        email: vendor.email,
        businessName: vendor.businessName,
        serviceCategories: vendor.serviceCategories,
        approvalStatus: vendor.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Vendor signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Vendor signup failed",
    });
  }
};

// COMMON LOGIN — ADMIN + CUSTOMER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    if (user.role === "vendor") {
      return res.status(403).json({
        success: false,
        message: "Please use the vendor login page",
      });
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// VENDOR LOGIN — VENDOR COLLECTION ONLY
const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const vendor = await Vendor.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      vendor.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (vendor.approvalStatus === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your vendor registration is waiting for Admin approval.",
        approvalStatus: "pending",
      });
    }

    if (vendor.approvalStatus === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your vendor registration has been rejected by Admin.",
        approvalStatus: "rejected",
      });
    }

    if (vendor.approvalStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your vendor account is not approved.",
      });
    }

    if (!vendor.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your vendor account has been deactivated by Admin.",
      });
    }

    const token = generateToken({
      id: vendor._id,
      role: "vendor",
    });

    return res.status(200).json({
      success: true,
      message: "Vendor login successful",
      token,
      user: {
        id: vendor._id,
        fullName: vendor.fullName,
        email: vendor.email,
        phone: vendor.phone,
        role: "vendor",
        businessName: vendor.businessName,
        serviceCategories: vendor.serviceCategories,
        approvalStatus: vendor.approvalStatus,
      },
    });
  } catch (error) {
    console.error("Vendor login error:", error);

    return res.status(500).json({
      success: false,
      message: "Vendor login failed",
    });
  }
};

// GET CURRENT USER
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Vendor token uses Vendor document ID
    if (req.user.role === "vendor") {
      const vendor = await Vendor.findById(userId).select("-password");

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      if (
        vendor.approvalStatus !== "approved" ||
        !vendor.isActive
      ) {
        return res.status(403).json({
          success: false,
          message: "Vendor account is not active or approved",
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: vendor._id,
          fullName: vendor.fullName,
          email: vendor.email,
          phone: vendor.phone,
          role: "vendor",
          businessName: vendor.businessName,
          serviceCategories: vendor.serviceCategories,
          approvalStatus: vendor.approvalStatus,
        },
        vendorProfile: vendor,
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUser(user),
      vendorProfile: null,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch user",
    });
  }
};

module.exports = {
  customerSignup,
  vendorSignup,
  login,
  vendorLogin,
  getMe,
};