
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  CalendarCheck,
  Tags,
  Wallet,
  UserRound,
  Bell,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", path: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "Opportunities", path: "/vendor/opportunities", icon: BriefcaseBusiness },
  { name: "My Applications", path: "/vendor/applications", icon: ClipboardList },
  { name: "My Assignments", path: "/vendor/assignments", icon: CalendarCheck },
  { name: "My Services & Pricing", path: "/vendor/services", icon: Tags },
  { name: "Payment History", path: "/vendor/payments", icon: Wallet },
  { name: "My Profile", path: "/vendor/profile", icon: UserRound },
];

export default function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 md:flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white p-5 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Eventora<span className="text-amber-600">.</span>
          </h1>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Vendor Workspace
        </p>

        <nav className="space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-amber-50 font-semibold text-amber-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/vendor/login";
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">

        {/* Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <h2 className="font-semibold text-gray-800">
              Vendor Portal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Bell size={20} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
              V
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
