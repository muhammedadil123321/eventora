import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Package,
  Users,
  UserCheck,
  CreditCard,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Activity,
  UserRound,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: UserRound,
  },
  {
    name: "Quotations",
    path: "/admin/quotations",
    icon: ClipboardList,
  },
  {
    name: "Packages",
    path: "/admin/packages",
    icon: Package,
  },
  {
    name: "Vendors",
    path: "/admin/vendors",
    icon: Users,
  },
  {
    name: "Vendor Applications",
    path: "/admin/vendor-applications",
    icon: UserCheck,
  },
  {
    name: "Vendor Assignments",
    path: "/admin/vendor-assignments",
    icon: ClipboardList,
  },
  {
    name: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Event Tracking",
    path: "/admin/event-tracking",
    icon: Activity,
  },
  {
    name: "Expenses",
    path: "/admin/expenses",
    icon: Wallet,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("eventora_token");
    const rawUser = localStorage.getItem("eventora_user");

    if (!token) {
      toast.error("Please login as Admin to access the admin panel.");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      if (!user || user.role !== "admin") {
        toast.error("You are currently logged in with a non-admin account. Please login as Admin.");
        navigate("/login");
        return;
      }
      setCurrentUser(user);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("eventora_token");
    localStorage.removeItem("eventora_user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 md:flex">
      <aside className="w-full border-r border-gray-200 bg-white p-5 md:min-h-screen md:w-64">
        <h1 className="mb-8 text-2xl font-bold tracking-tight">
          Eventora<span className="text-amber-600">.</span>
        </h1>

        <nav className="space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-amber-50 font-semibold text-amber-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          {/* Left Side */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-500">
              Manage your Eventora CRM
            </p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 transition hover:bg-gray-50">
                {/* Profile Avatar */}
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-amber-700">
                  <UserRound size={23} />
                </div>

                {/* Admin Information */}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || "Administrator"}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="text-gray-500 transition group-open:rotate-180"
                />
              </summary>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <div className="border-b border-gray-100 px-3 py-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser?.fullName || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email || "admin@eventora.com"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/admin/settings")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle size={18} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/settings")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={18} />
                  Settings
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </details>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
