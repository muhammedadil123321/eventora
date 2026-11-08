import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Connect to backend login API
      const response = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Save authentication details
      localStorage.setItem("eventora_token", response.token);
      localStorage.setItem("eventora_user", JSON.stringify(response.user));

      toast.success(response.message || "Login successful");

      // Redirect based on role returned by backend
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "customer") {
        navigate("/customer");
      } else {
        toast.error("Invalid user role");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your connection and try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-500 text-center">
          Sign in to your Eventora account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have a customer account?{" "}
          <Link
            to="/customer/signup"
            className="font-semibold text-gray-900 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
