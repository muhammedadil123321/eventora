import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  Eye,
  EyeOff,
  Camera,
  Video,
  Sparkles,
  Utensils,
  Palette,
  Music,
  Building2,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { vendorSignup } from "../../../services/authService";

const SERVICE_CATEGORIES = [
  { name: "Photography", icon: Camera },
  { name: "Videography", icon: Video },
  { name: "Decoration", icon: Sparkles },
  { name: "Catering", icon: Utensils },
  { name: "Makeup & Beauty", icon: Palette },
  { name: "Entertainment", icon: Music },
  { name: "Venue", icon: Building2 },
  { name: "Lighting & Sound", icon: Lightbulb },
];

const VendorSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  // Dynamic services list state
  const [services, setServices] = useState([
    { serviceName: "", pricingType: "", fixedPrice: "" },
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  // Personal info handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Service fields handler
  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [name]: value,
      ...(name === "pricingType" ? { fixedPrice: "" } : {}),
    };
    setServices(updatedServices);
  };

  // Add new service field ONLY IF current service fields are fully completed
  const addServiceRow = () => {
    const lastService = services[services.length - 1];

    if (
      !lastService.serviceName.trim() ||
      !lastService.pricingType ||
      !lastService.fixedPrice ||
      Number(lastService.fixedPrice) <= 0
    ) {
      toast.error(
        "Please complete the current service details before adding a new one."
      );
      return;
    }

    setServices((prev) => [
      ...prev,
      { serviceName: "", pricingType: "", fixedPrice: "" },
    ]);
  };

  // Remove a service row
  const removeServiceRow = (index) => {
    if (services.length === 1) {
      toast.error("You must keep at least one service field.");
      return;
    }
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle categories selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one service category");
      return;
    }

    // Validate all added services
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      if (
        !s.serviceName.trim() ||
        !s.pricingType ||
        !s.fixedPrice ||
        Number(s.fixedPrice) <= 0
      ) {
        toast.error(`Please complete all details for Service #${i + 1}`);
        return;
      }
    }

    const formattedServices = services.map((s) => ({
      name: s.serviceName.trim(),
      pricingType: "duration",
      rates: {
        [s.pricingType]: Number(s.fixedPrice),
      },
    }));

    const vendorData = {
      fullName: formData.fullName.trim(),
      businessName: formData.businessName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      experience: Number(formData.experience),
      password: formData.password,
      categories: selectedCategories,
      services: formattedServices,
      status: "pending_approval",
    };

    try {
      setLoading(true);

      const res = await vendorSignup(vendorData);
      console.log("Vendor registered:", res);

      toast.success("Registration request submitted to Admin successfully!");
      navigate("/vendor/pending");
    } catch (error) {
      console.error("Vendor signup submission error:", error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please check your connection and try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Store size={27} />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Become a Vendor
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Submit your profile for admin approval to join our event network.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name + Business Name */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="businessName" className={labelClass}>
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="organization"
                  required
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Address + Experience in One Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>
                  Address / Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your address or business location"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="experience" className={labelClass}>
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="e.g. 3"
                  value={formData.experience}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Service Categories */}
            <div className="border-t border-gray-100 pt-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Categories
                  <span className="text-red-500"> *</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select the categories your business provides.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SERVICE_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(
                    category.name
                  );

                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => toggleCategory(category.name)}
                      aria-pressed={isSelected}
                      className={`flex min-h-[105px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition ${
                        isSelected
                          ? "border-amber-600 bg-amber-100 text-amber-800 shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:bg-amber-50"
                      }`}
                    >
                      <Icon size={23} />
                      <span className="text-xs font-semibold">
                        {category.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-gray-400">
                {selectedCategories.length} categories selected
              </p>
            </div>

            {/* Service Details Section */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Service Details <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter your service and pricing details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addServiceRow}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 border border-amber-200"
                >
                  <Plus size={16} />
                  Add Service
                </button>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Service #{index + 1}
                      </span>
                      {services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeServiceRow(index)}
                          className="text-red-500 hover:text-red-700 transition p-1"
                          title="Remove Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Service Name */}
                      <div>
                        <label className={labelClass}>
                          Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="serviceName"
                          type="text"
                          placeholder="e.g. Wedding Photography"
                          value={service.serviceName}
                          onChange={(e) => handleServiceChange(index, e)}
                          className={inputClass}
                          required
                        />
                      </div>

                      {/* Price Method */}
                      <div>
                        <label className={labelClass}>
                          Price Method <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="pricingType"
                          value={service.pricingType}
                          onChange={(e) => handleServiceChange(index, e)}
                          className={inputClass}
                          required
                        >
                          <option value="">Select price method</option>
                          <option value="hourly">Hourly</option>
                          <option value="halfDay">Half Day</option>
                          <option value="fullDay">Full Day</option>
                        </select>
                      </div>

                      {/* Fixed Price */}
                      <div>
                        <label className={labelClass}>
                          Fixed Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="fixedPrice"
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter fixed price"
                          value={service.fixedPrice}
                          onChange={(e) => handleServiceChange(index, e)}
                          className={inputClass}
                          disabled={!service.pricingType}
                          required
                        />
                      </div>
                    </div>

                    {service.pricingType && (
                      <p className="mt-2 text-xs text-gray-400">
                        {service.pricingType === "hourly"
                          ? "Charged per hour."
                          : service.pricingType === "halfDay"
                          ? "Charged for half-day service."
                          : "Charged for full-day service."}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="border-t border-gray-100 pt-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Password */}
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-12`}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClass} pr-12`}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Password must contain at least 8 characters.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting Request..." : "Send Request to Admin"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/vendor/login")}
                className="font-semibold text-amber-700 hover:text-amber-800"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;