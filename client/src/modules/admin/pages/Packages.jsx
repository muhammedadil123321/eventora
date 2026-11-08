
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Package,
  CheckCircle,
  Clock,
  EyeOff,
  Image as ImageIcon,
  PlusCircle,
  MinusCircle,
  Layers,
  IndianRupee,
  Users,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TIERS = [
  { value: "budget", label: "Budget Friendly" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const EVENTS = [
  "Wedding",
  "Engagement",
  "Birthday",
  "Corporate",
  "Private Party",
];

const CATEGORIES = [
  "Photography",
  "Videography",
  "Catering",
  "Decoration",
  "Lighting",
  "Sound",
  "Stage",
  "Makeup",
  "Entertainment",
  "Transportation",
];

const SAMPLE_VENDORS = [
  {
    _id: "v1",
    name: "Pixel Photography",
    categories: ["Photography", "Videography"],
  },
  {
    _id: "v2",
    name: "Royal Catering",
    categories: ["Catering"],
  },
  {
    _id: "v3",
    name: "Dream Decor",
    categories: ["Decoration", "Stage"],
  },
  {
    _id: "v4",
    name: "Elite Events",
    categories: ["Lighting", "Sound"],
  },
  {
    _id: "v5",
    name: "Glamour Studio",
    categories: ["Makeup"],
  },
  {
    _id: "v6",
    name: "Moments Studio",
    categories: ["Photography", "Videography"],
  },
];

const INITIAL_PACKAGES = [
  {
    _id: "p1",
    name: "Classic Wedding Package",
    eventType: "Wedding",
    tier: "budget",
    description: "Essential services for a beautiful wedding celebration.",
    image: "",
    priceMin: 75000,
    priceMax: 120000,
    status: "published",
    services: [
      {
        category: "Photography",
        description: "Wedding photography coverage",
        pricingType: "fullDay",
        preferredVendors: ["v1", "v6"],
      },
      {
        category: "Catering",
        description: "Food arrangements",
        pricingType: "fullDay",
        preferredVendors: ["v2"],
      },
      {
        category: "Decoration",
        description: "Basic stage and venue decoration",
        pricingType: "fullDay",
        preferredVendors: ["v3"],
      },
    ],
  },
  {
    _id: "p2",
    name: "Royal Wedding Package",
    eventType: "Wedding",
    tier: "premium",
    description: "Premium wedding experience with complete arrangements.",
    image: "",
    priceMin: 200000,
    priceMax: 350000,
    status: "published",
    services: [
      {
        category: "Photography",
        description: "Premium photo coverage",
        pricingType: "fullDay",
        preferredVendors: ["v1"],
      },
      {
        category: "Videography",
        description: "Cinematic wedding film",
        pricingType: "fullDay",
        preferredVendors: ["v6"],
      },
      {
        category: "Decoration",
        description: "Premium decoration",
        pricingType: "fullDay",
        preferredVendors: ["v3"],
      },
      {
        category: "Lighting",
        description: "Venue lighting",
        pricingType: "fullDay",
        preferredVendors: ["v4"],
      },
    ],
  },
  {
    _id: "p3",
    name: "Birthday Celebration",
    eventType: "Birthday",
    tier: "standard",
    description: "A complete birthday celebration package.",
    image: "",
    priceMin: 25000,
    priceMax: 45000,
    status: "draft",
    services: [
      {
        category: "Photography",
        description: "Birthday event photography",
        pricingType: "halfDay",
        preferredVendors: ["v1"],
      },
      {
        category: "Decoration",
        description: "Birthday theme decoration",
        pricingType: "fullDay",
        preferredVendors: ["v3"],
      },
    ],
  },
];

const EMPTY_FORM = {
  name: "",
  eventType: "Wedding",
  tier: "budget",
  description: "",
  image: "",
  priceMin: "",
  priceMax: "",
  status: "draft",
  services: [],
};

const money = (value) =>
  value === "" || value === null || value === undefined
    ? "—"
    : `₹${Number(value).toLocaleString("en-IN")}`;

export default function Packages() {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const stats = {
    total: packages.length,
    published: packages.filter((p) => p.status === "published").length,
    drafts: packages.filter((p) => p.status === "draft").length,
    unpublished: packages.filter((p) => p.status === "unpublished").length,
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      const query = search.toLowerCase();

      return (
        (p.name.toLowerCase().includes(query) ||
          p.eventType.toLowerCase().includes(query)) &&
        (tierFilter === "all" || p.tier === tierFilter) &&
        (eventFilter === "all" || p.eventType === eventFilter) &&
        (statusFilter === "all" || p.status === statusFilter)
      );
    });
  }, [packages, search, tierFilter, eventFilter, statusFilter]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, services: [] });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...EMPTY_FORM,
      ...item,
      services: item.services.map((s) => ({
        ...s,
        preferredVendors: [...s.preferredVendors],
      })),
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM, services: [] });
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          category: "",
          description: "",
          pricingType: "fullDay",
          preferredVendors: [],
        },
      ],
    }));
  };

  const updateService = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index
          ? {
              ...service,
              [field]: value,
              ...(field === "category" ? { preferredVendors: [] } : {}),
            }
          : service
      ),
    }));
  };

  const removeService = (index) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const toggleVendor = (serviceIndex, vendorId) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.map((service, index) => {
        if (index !== serviceIndex) return service;

        const selected = service.preferredVendors.includes(vendorId);

        return {
          ...service,
          preferredVendors: selected
            ? service.preferredVendors.filter((id) => id !== vendorId)
            : [...service.preferredVendors, vendorId],
        };
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Enter package name.");
      return;
    }

    if (form.services.length === 0) {
      toast.error("Add at least one service.");
      return;
    }

    if (form.services.some((s) => !s.category)) {
      toast.error("Select a category for every service.");
      return;
    }

    if (
      form.priceMin !== "" &&
      form.priceMax !== "" &&
      Number(form.priceMin) > Number(form.priceMax)
    ) {
      toast.error("Minimum price cannot exceed maximum price.");
      return;
    }

    const payload = {
      ...form,
      priceMin: form.priceMin === "" ? "" : Number(form.priceMin),
      priceMax: form.priceMax === "" ? "" : Number(form.priceMax),
    };

    if (editingId) {
      setPackages((prev) =>
        prev.map((p) =>
          p._id === editingId ? { ...payload, _id: editingId } : p
        )
      );
      toast.success("Package updated.");
    } else {
      setPackages((prev) => [
        { ...payload, _id: `p${Date.now()}` },
        ...prev,
      ]);
      toast.success("Package created.");
    }

    closeForm();
  };

  const toggleStatus = (id) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p._id !== id) return p;

        return {
          ...p,
          status: p.status === "published" ? "unpublished" : "published",
        };
      })
    );

    toast.success("Package status updated.");
  };

  const removePackage = (id) => {
    if (!window.confirm("Permanently delete this sample package?")) return;

    setPackages((prev) => prev.filter((p) => p._id !== id));
    toast.success("Package deleted.");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Package Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage event packages, services and preferred vendors.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700"
        >
          <Plus size={18} />
          Create Package
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Packages"
          value={stats.total}
          icon={<Package size={21} />}
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={<CheckCircle size={21} />}
        />
        <StatCard
          title="Draft"
          value={stats.drafts}
          icon={<Clock size={21} />}
        />
        <StatCard
          title="Unpublished"
          value={stats.unpublished}
          icon={<EyeOff size={21} />}
        />
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Filter size={17} />
          Filters
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search package..."
              className="field pl-10"
            />
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="field"
          >
            <option value="all">All Tiers</option>
            {TIERS.map((tier) => (
              <option key={tier.value} value={tier.value}>
                {tier.label}
              </option>
            ))}
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="field"
          >
            <option value="all">All Event Types</option>
            {EVENTS.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="field"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      {/* PACKAGE TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div>
            <h2 className="font-semibold text-gray-900">All Packages</h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredPackages.length} packages
            </p>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={36} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-700">No packages found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or create a package.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Package</th>
                  <th className="px-5 py-4">Event Type</th>
                  <th className="px-5 py-4">Tier</th>
                  <th className="px-5 py-4">Price Range</th>
                  <th className="px-5 py-4">Services</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPackages.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={19} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.eventType}
                    </td>

                    <td className="px-5 py-4">
                      <TierBadge tier={item.tier} />
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      {money(item.priceMin)} - {money(item.priceMax)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.services.length} services
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          title="View"
                          onClick={() => {
                            setSelectedPackage(item);
                            setShowDetails(true);
                          }}
                        >
                          <Eye size={16} />
                        </IconButton>

                        <IconButton
                          title="Edit"
                          onClick={() => openEdit(item)}
                        >
                          <Edit size={16} />
                        </IconButton>

                        <IconButton
                          title={
                            item.status === "published"
                              ? "Unpublish"
                              : "Publish"
                          }
                          onClick={() => toggleStatus(item._id)}
                        >
                          {item.status === "published" ? (
                            <EyeOff size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </IconButton>

                        <IconButton
                          title="Delete"
                          danger
                          onClick={() => removePackage(item._id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 md:p-6">
          <div className="my-5 w-full max-w-5xl rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-xl border-b bg-white p-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId ? "Edit Package" : "Create Package"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Add package details, services and preferred vendors.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 p-5">
              {/* BASIC INFORMATION */}
              <section className="space-y-4">
                <SectionTitle number="01" title="Basic Information" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Package Name" required>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="Example: Royal Wedding Package"
                      className="field"
                    />
                  </FormField>

                  <FormField label="Event Type" required>
                    <select
                      value={form.eventType}
                      onChange={(e) =>
                        updateForm("eventType", e.target.value)
                      }
                      className="field"
                    >
                      {EVENTS.map((event) => (
                        <option key={event}>{event}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Package Tier" required>
                    <select
                      value={form.tier}
                      onChange={(e) => updateForm("tier", e.target.value)}
                      className="field"
                    >
                      {TIERS.map((tier) => (
                        <option key={tier.value} value={tier.value}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Package Image URL">
                    <input
                      value={form.image}
                      onChange={(e) => updateForm("image", e.target.value)}
                      placeholder="Paste image URL"
                      className="field"
                    />
                  </FormField>
                </div>

                {form.image && (
                  <img
                    src={form.image}
                    alt="Package preview"
                    className="h-36 w-56 rounded-lg border object-cover"
                  />
                )}

                <FormField label="Package Description">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      updateForm("description", e.target.value)
                    }
                    placeholder="Describe this package..."
                    className="field"
                  />
                </FormField>
              </section>

              <Divider />

              {/* PRICING */}
              <section className="space-y-4">
                <SectionTitle number="02" title="Package Pricing" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Minimum Price (₹)">
                    <input
                      type="number"
                      min="0"
                      value={form.priceMin}
                      onChange={(e) =>
                        updateForm("priceMin", e.target.value)
                      }
                      placeholder="25000"
                      className="field"
                    />
                  </FormField>

                  <FormField label="Maximum Price (₹)">
                    <input
                      type="number"
                      min="0"
                      value={form.priceMax}
                      onChange={(e) =>
                        updateForm("priceMax", e.target.value)
                      }
                      placeholder="50000"
                      className="field"
                    />
                  </FormField>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  This is the estimated customer-facing package price.
                  Final pricing can be confirmed through the quotation process.
                </div>
              </section>

              <Divider />

              {/* SERVICES */}
              <section className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <SectionTitle number="03" title="Package Services" />

                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    <PlusCircle size={17} />
                    Add Service
                  </button>
                </div>

                {form.services.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                    <Layers
                      size={30}
                      className="mx-auto mb-2 text-gray-400"
                    />
                    <p className="text-sm font-medium text-gray-700">
                      No services added
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Add services included in this package.
                    </p>
                  </div>
                )}

                {form.services.map((service, index) => {
                  const matchingVendors = SAMPLE_VENDORS.filter((vendor) =>
                    vendor.categories.includes(service.category)
                  );

                  return (
                    <div
                      key={index}
                      className="space-y-4 rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          Service {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          <MinusCircle size={16} />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField label="Service Category" required>
                          <select
                            value={service.category}
                            onChange={(e) =>
                              updateService(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                            className="field"
                          >
                            <option value="">Select category</option>
                            {CATEGORIES.map((category) => (
                              <option key={category}>{category}</option>
                            ))}
                          </select>
                        </FormField>

                        <FormField label="Pricing Type">
                          <select
                            value={service.pricingType}
                            onChange={(e) =>
                              updateService(
                                index,
                                "pricingType",
                                e.target.value
                              )
                            }
                            className="field"
                          >
                            <option value="hourly">Hourly</option>
                            <option value="halfDay">Half Day</option>
                            <option value="fullDay">Full Day</option>
                            <option value="custom">Custom</option>
                          </select>
                        </FormField>

                        <FormField label="Service Description">
                          <input
                            value={service.description}
                            onChange={(e) =>
                              updateService(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Service details..."
                            className="field"
                          />
                        </FormField>
                      </div>

                      {/* VENDOR SELECTION */}
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Preferred Vendors
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              Select vendors for {service.category || "this service"}.
                            </p>
                          </div>

                          <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600">
                            {service.preferredVendors.length} selected
                          </span>
                        </div>

                        {!service.category ? (
                          <p className="text-xs text-gray-500">
                            Select a service category first.
                          </p>
                        ) : matchingVendors.length === 0 ? (
                          <p className="text-xs text-amber-700">
                            No matching vendors available.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {matchingVendors.map((vendor) => (
                              <label
                                key={vendor._id}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:border-gray-400"
                              >
                                <input
                                  type="checkbox"
                                  checked={service.preferredVendors.includes(
                                    vendor._id
                                  )}
                                  onChange={() =>
                                    toggleVendor(index, vendor._id)
                                  }
                                  className="h-4 w-4 accent-gray-900"
                                />

                                <div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {vendor.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {vendor.categories.join(", ")}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>

              <Divider />

              {/* STATUS */}
              <section className="space-y-3">
                <SectionTitle number="04" title="Publishing" />

                <FormField label="Package Status">
                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className="field"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                </FormField>

                <p className="text-xs text-gray-500">
                  Published packages are intended to appear on the customer
                  website.
                </p>
              </section>

              <div className="flex flex-col-reverse justify-end gap-3 border-t pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  {editingId ? "Update Package" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {showDetails && selectedPackage && (
        <DetailsModal
          item={selectedPackage}
          onClose={() => {
            setShowDetails(false);
            setSelectedPackage(null);
          }}
        />
      )}

      <style>{`
        .field {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13px;
          color: #374151;
          outline: none;
          background: white;
        }
        .field:focus {
          border-color: #6b7280;
          box-shadow: 0 0 0 2px rgba(107,114,128,.1);
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="rounded-lg bg-gray-100 p-3 text-gray-700">
        {icon}
      </div>
    </div>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
        {number}
      </span>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-100" />;
}

function TierBadge({ tier }) {
  const label = TIERS.find((item) => item.value === tier)?.label || tier;

  return (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    published: "bg-green-50 text-green-700",
    draft: "bg-amber-50 text-amber-700",
    unpublished: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function IconButton({ children, onClick, title, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg border p-2 ${
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-gray-200 text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function DetailsModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-3">
      <div className="my-5 w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold text-gray-900">Package Details</h2>
            <p className="mt-1 text-xs text-gray-500">
              {item.eventType} · {item.tier}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="h-48 w-full rounded-lg object-cover"
            />
          )}

          <div>
            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailCard
              label="Price Range"
              value={`${money(item.priceMin)} - ${money(item.priceMax)}`}
            />
            <DetailCard label="Status" value={item.status} />
            <DetailCard label="Event Type" value={item.eventType} />
            <DetailCard
              label="Total Services"
              value={item.services.length}
            />
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900">
              Included Services
            </h4>

            <div className="space-y-3">
              {item.services.map((service, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">
                      {service.category}
                    </p>
                    <span className="text-xs text-gray-500">
                      {service.pricingType}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {service.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-600">
                    Preferred Vendors: {service.preferredVendors.length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-4 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  );
}
