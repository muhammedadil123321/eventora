import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { vendorLogin } from "../../../services/authService";

export default function VendorLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await vendorLogin({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      // Save token & vendor data
      localStorage.setItem("eventora_token", response.token);
      localStorage.setItem("eventora_user", JSON.stringify(response.user));

      toast.success(response.message || "Vendor login successful!");
      navigate("/vendor/dashboard");
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 403 && data?.approvalStatus === "pending") {
        toast("Your account is waiting for Admin approval");
        navigate("/vendor/pending");
        return;
      }

      toast.error(
        data?.message || "Vendor login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Vendor Login
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Login to your Eventora vendor account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-amber-600"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/vendor/signup"
            className="font-semibold text-amber-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
