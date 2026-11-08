import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f8f7f4] p-5 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="text-sm text-gray-500">
        The page you are looking for does not exist or was moved.
      </p>
      <Link to="/" className="text-sm font-medium text-gray-700 underline">
        Go to home
      </Link>
    </div>
  );
}