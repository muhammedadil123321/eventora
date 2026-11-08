const mongoose = require("mongoose");

const vendorServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pricingType: {
      type: String,
      enum: ["duration"],
      default: "duration",
    },
    rates: {
      hourly: { type: Number, min: 0 },
      halfDay: { type: Number, min: 0 },
      fullDay: { type: Number, min: 0 },
    },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceCategories: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one service category is required",
      },
    },
    services: {
      type: [vendorServiceSchema],
      default: [],
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    approvalEmailSent: {
      type: Boolean,
      default: false,
    },
    approvalEmailSentAt: {
      type: Date,
      default: null,
    },
    rejectionEmailSent: {
      type: Boolean,
      default: false,
    },
    rejectionEmailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vendor", vendorSchema);