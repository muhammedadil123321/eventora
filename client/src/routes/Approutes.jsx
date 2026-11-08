import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import VendorLayout from "../layouts/VendorLayout";

// Auth
import Login from "../modules/auth/Login";
import CustomerSignup from "../modules/customer/auth/CustomerSignup";
import VendorSignup from "../modules/vendor/auth/VendorSignup";
import VendorLogin from "../modules/vendor/auth/VendorLogin";
import VendorPending from "../modules/vendor/auth/VendorPending";

// Admin pages
import AdminDashboard from "../modules/admin/pages/AdminDashboard";


// Customer pages
import CustomerHome from "../modules/customer/pages/CustomerHome";

// Vendor pages
import VendorDashboard from "../modules/vendor/pages/VendorDashboard";

// Shared
import NotFound from "../components/NotFound";
import Bookings from "../modules/admin/pages/Bookings";
import Customers from "../modules/admin/pages/Customers";
import Quotations from "../modules/admin/pages/Quotations";
import Packages from "../modules/admin/pages/Packages";
import Vendors from "../modules/admin/pages/Vendors";
import VendorApplications from "../modules/admin/pages/VendorApplications";
import VendorAssignments from "../modules/admin/pages/VendorAssignments";
import Payments from "../modules/admin/pages/Payments";
import EventTracking from "../modules/admin/pages/EventTracking";
import Expenses from "../modules/admin/pages/Expenses";
import Reports from "../modules/admin/pages/Reports";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="packages" element={<Packages />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="vendor-applications" element={<VendorApplications />} />
          <Route path="vendor-assignments" element={<VendorAssignments />} />
          <Route path="payments" element={<Payments />} />
          <Route path="event-tracking" element={<EventTracking />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="reports" element={<Reports />} />
          
        </Route>

        {/* Customer */}
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />

        {/* Vendor */}
        <Route path="/vendor/signup" element={<VendorSignup />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/pending" element={<VendorPending />} />
        <Route element={<VendorLayout />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}