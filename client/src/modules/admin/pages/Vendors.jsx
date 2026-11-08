
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Store,
  RefreshCw,
  Check,
  X,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Eye,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getVendors,
  approveVendor,
  rejectVendor,
  toggleVendorStatus,
  deleteVendor,
} from "../services/adminapi";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedVendor, setSelectedVendor] = useState(null);

  // --------------------------------------------------
  // FETCH VENDORS
  // --------------------------------------------------

  const fetchVendorsList = async () => {
    try {
      setLoading(true);

      const params = {};

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const data = await getVendors(params);

      setVendors(data.vendors || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorsList();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVendorsList();
  };

  // --------------------------------------------------
  // APPROVE VENDOR
  // --------------------------------------------------

  const handleApprove = async (vendor) => {
    const confirmed = window.confirm(
      `Approve "${vendor.businessName}" and send approval email?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await approveVendor(vendor._id);

      toast.success(res.message || "Vendor approved successfully");

      if (selectedVendor?._id === vendor._id) {
        setSelectedVendor((prev) => ({
          ...prev,
          approvalStatus: "approved",
          isActive: true,
        }));
      }

      await fetchVendorsList();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve vendor"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // REJECT VENDOR
  // --------------------------------------------------

  const handleReject = async (vendor) => {
    const confirmed = window.confirm(
      `Reject "${vendor.businessName}" application?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await rejectVendor(vendor._id);

      toast.success(res.message || "Vendor rejected");

      if (selectedVendor?._id === vendor._id) {
        setSelectedVendor((prev) => ({
          ...prev,
          approvalStatus: "rejected",
          isActive: false,
        }));
      }

      await fetchVendorsList();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject vendor"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // BLOCK / UNBLOCK VENDOR
  // --------------------------------------------------

  const handleToggleStatus = async (vendor) => {
    const action = vendor.isActive ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${vendor.businessName}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await toggleVendorStatus(vendor._id);

      toast.success(res.message || "Vendor status updated");

      if (selectedVendor?._id === vendor._id) {
        setSelectedVendor((prev) => ({
          ...prev,
          isActive: !prev.isActive,
        }));
      }

      await fetchVendorsList();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update vendor status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // PERMANENT DELETE VENDOR
  // --------------------------------------------------

  const handleDeleteVendor = async (vendor) => {
    const confirmed = window.confirm(
      `PERMANENT DELETE WARNING!\n\n` +
      `Are you sure you want to permanently delete "${vendor.businessName}"?\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const res = await deleteVendor(vendor._id);

      toast.success(res.message || "Vendor permanently deleted");

      if (selectedVendor?._id === vendor._id) {
        setSelectedVendor(null);
      }

      await fetchVendorsList();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete vendor"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------------------
  // STATISTICS
  // Counts are based on currently fetched results.
  // --------------------------------------------------

  const pendingCount = vendors.filter(
    (v) => v.approvalStatus === "pending"
  ).length;

  const approvedCount = vendors.filter(
    (v) => v.approvalStatus === "approved"
  ).length;

  const rejectedCount = vendors.filter(
    (v) => v.approvalStatus === "rejected"
  ).length;

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  const StatusBadge = ({ status }) => {
    const styles = {
      approved: "bg-emerald-50 text-emerald-700",
      rejected: "bg-red-50 text-red-700",
      pending: "bg-amber-50 text-amber-700",
    };

    const Icon =
      status === "approved"
        ? CheckCircle2
        : status === "rejected"
        ? XCircle
        : Clock;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
          styles[status] || styles.pending
        }`}
      >
        <Icon size={13} />
        {status || "pending"}
      </span>
    );
  };

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Vendor Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage vendor registrations, approvals and accounts.
          </p>
        </div>

        <button
          onClick={fetchVendorsList}
          disabled={loading || actionLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Vendors"
          count={vendors.length}
          icon={<Users size={20} />}
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        />

        <StatCard
          title="Pending Requests"
          count={pendingCount}
          icon={<Clock size={20} />}
          color="amber"
          active={statusFilter === "pending"}
          onClick={() => setStatusFilter("pending")}
        />

        <StatCard
          title="Approved"
          count={approvedCount}
          icon={<CheckCircle2 size={20} />}
          color="emerald"
          active={statusFilter === "approved"}
          onClick={() => setStatusFilter("approved")}
        />

        <StatCard
          title="Rejected"
          count={rejectedCount}
          icon={<XCircle size={20} />}
          color="red"
          active={statusFilter === "rejected"}
          onClick={() => setStatusFilter("rejected")}
        />

      </div>

      {/* SEARCH AND FILTER */}

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1"
        >
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search business, vendor name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* VENDOR TABLE */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <RefreshCw
              size={28}
              className="animate-spin text-amber-600"
            />

            <p className="text-sm font-medium text-gray-500">
              Loading vendor records...
            </p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center">
            <Store size={40} className="text-gray-300" />

            <p className="text-base font-semibold text-gray-700">
              No vendors found
            </p>

            <p className="text-sm text-gray-500">
              Vendor registration records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-left">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Business & Vendor</th>
                  <th className="px-6 py-4">Categories</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Approval</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">

                {vendors.map((vendor) => (
                  <tr
                    key={vendor._id}
                    className="transition hover:bg-gray-50/75"
                  >

                    {/* BUSINESS */}

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {vendor.businessName}
                      </div>

                      <div className="text-xs text-gray-500">
                        {vendor.fullName} · {vendor.experience || 0} yrs exp
                      </div>
                    </td>

                    {/* CATEGORIES */}

                    <td className="px-6 py-4">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {(vendor.serviceCategories || []).map((cat, idx) => (
                          <span
                            key={`${vendor._id}-${idx}`}
                            className="inline-flex rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800"
                          >
                            {cat}
                          </span>
                        ))}

                        {(!vendor.serviceCategories ||
                          vendor.serviceCategories.length === 0) && (
                          <span className="text-xs text-gray-400">
                            No categories
                          </span>
                        )}
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="space-y-1 px-6 py-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-gray-400" />
                        {vendor.email}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-gray-400" />
                        {vendor.phone}
                      </div>
                    </td>

                    {/* APPROVAL STATUS */}

                    <td className="px-6 py-4">
                      <StatusBadge status={vendor.approvalStatus} />
                    </td>

                    {/* ACCOUNT STATUS */}

                    <td className="px-6 py-4">
                      {vendor.approvalStatus === "approved" ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            vendor.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {vendor.isActive ? (
                            <ShieldCheck size={13} />
                          ) : (
                            <ShieldOff size={13} />
                          )}

                          {vendor.isActive ? "Active" : "Blocked"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">

                        {vendor.approvalStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor)}
                              disabled={actionLoading}
                              title="Approve Vendor"
                              className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <Check size={15} />
                            </button>

                            <button
                              onClick={() => handleReject(vendor)}
                              disabled={actionLoading}
                              title="Reject Vendor"
                              className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100 disabled:opacity-50"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          title="View Details"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Eye size={15} />
                        </button>

                        {vendor.approvalStatus === "approved" && (
                          <button
                            onClick={() => handleToggleStatus(vendor)}
                            disabled={actionLoading}
                            title={
                              vendor.isActive
                                ? "Block Vendor"
                                : "Unblock Vendor"
                            }
                            className={`rounded-lg border p-2 disabled:opacity-50 ${
                              vendor.isActive
                                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {vendor.isActive ? (
                              <ShieldOff size={15} />
                            ) : (
                              <ShieldCheck size={15} />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteVendor(vendor)}
                          disabled={actionLoading}
                          title="Permanently Delete Vendor"
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* --------------------------------------------------
          VENDOR DETAILS MODAL
      -------------------------------------------------- */}

      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedVendor.businessName}
                </h3>

                <p className="text-xs text-gray-500">
                  Vendor ID: {selectedVendor._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedVendor(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-5">

              {/* CONTACT & BUSINESS INFO */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoCard title="Contact Information">
                  <p className="font-semibold text-gray-800">
                    {selectedVendor.fullName}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    {selectedVendor.email}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    {selectedVendor.phone}
                  </p>
                </InfoCard>

                <InfoCard title="Business Information">
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong>{" "}
                    {selectedVendor.address || "Not provided"}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Experience:</strong>{" "}
                    {selectedVendor.experience || 0} years
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <strong>Approval:</strong>
                    <StatusBadge status={selectedVendor.approvalStatus} />
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Account:</strong>{" "}
                    {selectedVendor.isActive ? "Active" : "Blocked"}
                  </p>
                </InfoCard>

              </div>

              {/* CATEGORIES */}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Service Categories
                </h4>

                <div className="mt-2 flex flex-wrap gap-2">
                  {(selectedVendor.serviceCategories || []).map((cat, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-amber-100/70 px-3 py-1 text-xs font-medium text-amber-900"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* SERVICES */}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Services & Pricing
                </h4>

                {selectedVendor.services?.length > 0 ? (
                  <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-100">

                    {selectedVendor.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col justify-between gap-2 p-3 sm:flex-row sm:items-center"
                      >
                        <span className="font-medium text-gray-800">
                          {service.name}
                        </span>

                        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                          {service.rates?.hourly != null && (
                            <span>₹{service.rates.hourly} / hr</span>
                          )}

                          {service.rates?.halfDay != null && (
                            <span>₹{service.rates.halfDay} / half-day</span>
                          )}

                          {service.rates?.fullDay != null && (
                            <span>₹{service.rates.fullDay} / full-day</span>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">
                    No services registered.
                  </p>
                )}
              </div>

              {/* MODAL ACTIONS */}

              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">

                {selectedVendor.approvalStatus === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedVendor)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check size={15} /> Approve
                    </button>

                    <button
                      onClick={() => handleReject(selectedVendor)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <X size={15} /> Reject
                    </button>
                  </>
                )}

                {selectedVendor.approvalStatus === "approved" && (
                  <button
                    onClick={() => handleToggleStatus(selectedVendor)}
                    disabled={actionLoading}
                    className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                  >
                    {selectedVendor.isActive
                      ? "Block Vendor"
                      : "Unblock Vendor"}
                  </button>
                )}

                <button
                  onClick={() => handleDeleteVendor(selectedVendor)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 size={15} /> Delete
                </button>

                <button
                  onClick={() => setSelectedVendor(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --------------------------------------------------
// REUSABLE COMPONENTS
// --------------------------------------------------

function StatCard({
  title,
  count,
  icon,
  color = "gray",
  active,
  onClick,
}) {
  const colors = {
    gray: "text-gray-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    red: "text-red-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active
          ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>

        <span className={colors[color]}>
          {icon}
        </span>
      </div>

      <p className={`mt-3 text-3xl font-bold ${colors[color]}`}>
        {count}
      </p>
    </button>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>

      {children}
    </div>
  );
}
