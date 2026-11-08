
import { Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function VendorPending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f4] p-5">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Clock3 size={32} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Registration Submitted!
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your vendor registration is currently under review.
          Our Admin team will review your business details and
          assign an appropriate package category.
        </p>

        <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm font-medium text-amber-800">
          Account Status: Pending Approval
        </div>

        <Link
          to="/vendor/login"
          className="mt-6 inline-block text-sm font-medium text-gray-700 underline"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
