import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
  X,
  ShieldCheck,
  ShieldOff,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getCustomers,
  getCustomerById,
  toggleCustomerStatus,
  deleteCustomer,
} from "../services/adminapi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  // FETCH CUSTOMERS
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers({
        search: appliedSearch,
      });

      setCustomers(response.customers || []);
    } catch (error) {
      console.error("Fetch customers error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [appliedSearch]);

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(search.trim());
  };

  // STATUS FILTER
  const filteredCustomers = useMemo(() => {
    if (statusFilter === "active") {
      return customers.filter((customer) => customer.isActive);
    }

    if (statusFilter === "blocked") {
      return customers.filter((customer) => !customer.isActive);
    }

    return customers;
  }, [customers, statusFilter]);

  // STATISTICS
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.isActive
  ).length;

  const blockedCustomers = customers.filter(
    (customer) => !customer.isActive
  ).length;

  // BLOCK / UNBLOCK
  const handleToggleStatus = async (customer) => {
    const action = customer.isActive ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${customer.fullName}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(customer._id);

      const response = await toggleCustomerStatus(customer._id);

      toast.success(
        response.message || "Customer status updated successfully"
      );

      await fetchCustomers();

      if (selectedCustomer?._id === customer._id) {
        setSelectedCustomer((prev) => ({
          ...prev,
          isActive: !prev.isActive,
        }));
      }
    } catch (error) {
      console.error("Toggle customer status error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update customer status"
      );
    } finally {
      setActionLoading("");
    }
  };

  // PERMANENT DELETE
  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Permanently delete ${customer.fullName}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(customer._id);

      const response = await deleteCustomer(customer._id);

      toast.success(
        response.message || "Customer deleted successfully"
      );

      setCustomers((prev) =>
        prev.filter((item) => item._id !== customer._id)
      );

      if (selectedCustomer?._id === customer._id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Delete customer error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer"
      );
    } finally {
      setActionLoading("");
    }
  };

  // VIEW CUSTOMER DETAILS
  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      setSelectedCustomer(null);

      const response = await getCustomerById(id);

      setSelectedCustomer(response.customer);
    } catch (error) {
      console.error("Get customer details error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load customer details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor registered customer accounts
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users size={21} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Active Customers"
          value={activeCustomers}
          icon={<ShieldCheck size={21} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />

        <StatCard
          title="Blocked Customers"
          value={blockedCustomers}
          icon={<ShieldOff size={21} />}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />

      </div>

      {/* SEARCH AND FILTER */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <form
            onSubmit={handleSearch}
            className="flex w-full gap-2 md:max-w-md"
          >
            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or phone..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-gray-400"
              />

            </div>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2">

            {[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Blocked", value: "blocked" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  statusFilter === filter.value
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filter.label}
              </button>
            ))}

          </div>

        </div>
      </div>

      {/* CUSTOMER TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Customer List
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredCustomers.length} customers found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <RefreshCw
              size={26}
              className="animate-spin text-gray-400"
            />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Users size={38} className="mb-3 text-gray-300" />

            <h3 className="font-semibold text-gray-800">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-gray-50">
                <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Joined Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* CUSTOMER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                          <UserRound size={19} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.fullName}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            ID: {customer._id.slice(-8)}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-5 py-4">

                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone}
                      </p>

                    </td>

                    {/* JOINED DATE */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(customer.createdAt)}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge isActive={customer.isActive} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-2">

                        <ActionButton
                          title="View Details"
                          onClick={() => handleViewDetails(customer._id)}
                          disabled={!!actionLoading}
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          title={
                            customer.isActive
                              ? "Block Customer"
                              : "Unblock Customer"
                          }
                          onClick={() => handleToggleStatus(customer)}
                          disabled={!!actionLoading}
                          color={
                            customer.isActive ? "orange" : "green"
                          }
                        >
                          {actionLoading === customer._id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : customer.isActive ? (
                            <Ban size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </ActionButton>

                        <ActionButton
                          title="Permanently Delete"
                          onClick={() => handleDelete(customer)}
                          disabled={!!actionLoading}
                          color="red"
                        >
                          <Trash2 size={16} />
                        </ActionButton>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        )}

      </div>

      {/* CUSTOMER DETAILS MODAL */}
      {(selectedCustomer || detailsLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">

            {detailsLoading ? (
              <div className="flex min-h-64 items-center justify-center">
                <RefreshCw
                  size={26}
                  className="animate-spin text-gray-400"
                />
              </div>
            ) : (
              <>

                {/* MODAL HEADER */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Customer Details
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Customer account information
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    <X size={20} />
                  </button>

                </div>

                {/* MODAL CONTENT */}
                <div className="p-6">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <UserRound size={26} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedCustomer.fullName}
                      </h3>

                      <StatusBadge
                        isActive={selectedCustomer.isActive}
                      />
                    </div>

                  </div>

                  <div className="space-y-4">

                    <InfoRow
                      icon={<Mail size={17} />}
                      label="Email Address"
                      value={selectedCustomer.email}
                    />

                    <InfoRow
                      icon={<Phone size={17} />}
                      label="Phone Number"
                      value={selectedCustomer.phone}
                    />

                    <InfoRow
                      icon={<CalendarDays size={17} />}
                      label="Registration Date"
                      value={formatDate(selectedCustomer.createdAt)}
                    />

                    <InfoRow
                      icon={<UserRound size={17} />}
                      label="Customer ID"
                      value={selectedCustomer._id}
                    />

                  </div>

                </div>

                {/* MODAL ACTIONS */}
                <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">

                  <button
                    onClick={() => handleToggleStatus(selectedCustomer)}
                    disabled={!!actionLoading}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                      selectedCustomer.isActive
                        ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {selectedCustomer.isActive ? (
                      <>
                        <Ban size={16} />
                        Block Customer
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Unblock Customer
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedCustomer)}
                    disabled={!!actionLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

// STATUS BADGE
const StatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
      isActive
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        isActive ? "bg-green-600" : "bg-red-600"
      }`}
    />

    {isActive ? "Active" : "Blocked"}
  </span>
);

// STAT CARD
const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">

    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm text-gray-500">{title}</p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          {value}
        </h3>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

    </div>

  </div>
);

// ACTION BUTTON
const ActionButton = ({
  children,
  title,
  onClick,
  disabled,
  color = "gray",
}) => {

  const colors = {
    gray: "text-gray-600 hover:bg-gray-100",
    orange: "text-orange-600 hover:bg-orange-50",
    green: "text-green-600 hover:bg-green-50",
    red: "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${colors[color]}`}
    >
      {children}
    </button>
  );
};

// INFO ROW
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">

    <div className="mt-0.5 text-gray-400">
      {icon}
    </div>

    <div className="min-w-0 flex-1">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-gray-800">
        {value || "—"}
      </p>

    </div>

  </div>
);

export default Customers;