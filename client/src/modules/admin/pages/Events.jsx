
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Package,
  Edit,
  Trash2,
  Eye,
  X,
  ImagePlus,
  CheckCircle,
  Clock,
  EyeOff,
  ArrowLeft,
  Layers,
  PlusCircle,
  MinusCircle,
  Save,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "event_crm_events";

const EVENT_TIERS = [
  {
    value: "budget",
    label: "Budget Friendly",
    description: "Affordable event package",
  },
  {
    value: "standard",
    label: "Standard",
    description: "Balanced event experience",
  },
  {
    value: "premium",
    label: "Premium",
    description: "Premium event experience",
  },
];

const SERVICE_CATEGORIES = [
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
  "Other",
];

// Sample vendors for UI preview only
const SAMPLE_VENDORS = [
  {
    id: "v1",
    name: "Pixel Photography",
    categories: ["Photography", "Videography"],
  },
  {
    id: "v2",
    name: "Royal Catering",
    categories: ["Catering"],
  },
  {
    id: "v3",
    name: "Dream Decor",
    categories: ["Decoration", "Stage"],
  },
  {
    id: "v4",
    name: "Elite Events",
    categories: ["Lighting", "Sound"],
  },
  {
    id: "v5",
    name: "Glamour Studio",
    categories: ["Makeup"],
  },
  {
    id: "v6",
    name: "Moments Studio",
    categories: ["Photography", "Videography"],
  },
];

const EMPTY_PACKAGE = {
  name: "",
  description: "",
  image: "",
  price: "",
  services: [],
};

const EMPTY_EVENT = {
  name: "",
  description: "",
  image: "",
  displayOrder: 1,
  status: "draft",
  packages: {
    budget: { ...EMPTY_PACKAGE, services: [] },
    standard: { ...EMPTY_PACKAGE, services: [] },
    premium: { ...EMPTY_PACKAGE, services: [] },
  },
};

const SAMPLE_EVENTS = [
  {
    id: "event-1",
    name: "Wedding",
    description: "Make your special day unforgettable with our wedding event services.",
    image: "",
    displayOrder: 1,
    status: "published",
    packages: {
      budget: {
        name: "Classic Wedding",
        description: "Essential wedding arrangements.",
        image: "",
        price: "50000",
        services: [
          {
            category: "Photography",
            description: "Wedding photography coverage",
            pricingType: "fullDay",
            preferredVendors: ["v1"],
          },
          {
            category: "Decoration",
            description: "Basic wedding decoration",
            pricingType: "fullDay",
            preferredVendors: ["v3"],
          },
        ],
      },
      standard: {
        name: "Elegant Wedding",
        description: "A balanced wedding experience.",
        image: "",
        price: "100000",
        services: [
          {
            category: "Photography",
            description: "Photography and album",
            pricingType: "fullDay",
            preferredVendors: ["v1", "v6"],
          },
          {
            category: "Catering",
            description: "Wedding catering",
            pricingType: "fullDay",
            preferredVendors: ["v2"],
          },
          {
            category: "Decoration",
            description: "Stage and venue decoration",
            pricingType: "fullDay",
            preferredVendors: ["v3"],
          },
        ],
      },
      premium: {
        name: "Royal Wedding",
        description: "A complete luxury wedding experience.",
        image: "",
        price: "200000",
        services: [
          {
            category: "Photography",
            description: "Premium photography",
            pricingType: "fullDay",
            preferredVendors: ["v1", "v6"],
          },
          {
            category: "Videography",
            description: "Cinematic video coverage",
            pricingType: "fullDay",
            preferredVendors: ["v1"],
          },
          {
            category: "Catering",
            description: "Premium catering",
            pricingType: "fullDay",
            preferredVendors: ["v2"],
          },
          {
            category: "Lighting",
            description: "Premium lighting",
            pricingType: "fullDay",
            preferredVendors: ["v4"],
          },
        ],
      },
    },
  },
];

const readEvents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      return JSON.parse(saved);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_EVENTS));
    return SAMPLE_EVENTS;
  } catch {
    return SAMPLE_EVENTS;
  }
};

const money = (value) => {
  if (value === "" || value === null || value === undefined) {
    return "Not set";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const makeEmptyEvent = () => ({
  ...EMPTY_EVENT,
  packages: {
    budget: { ...EMPTY_PACKAGE, services: [] },
    standard: { ...EMPTY_PACKAGE, services: [] },
    premium: { ...EMPTY_PACKAGE, services: [] },
  },
});

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [view, setView] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [form, setForm] = useState(makeEmptyEvent());

  useEffect(() => {
    setEvents(readEvents());
    setLoading(false);
  }, []);

  // Save every change to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, loading]);

  const stats = {
    total: events.length,
    published: events.filter((e) => e.status === "published").length,
    draft: events.filter((e) => e.status === "draft").length,
    unpublished: events.filter((e) => e.status === "unpublished").length,
  };

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchesSearch = event.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || event.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [events, search, statusFilter]);

  const updateEventField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePackageField = (tier, field, value) => {
    setForm((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [tier]: {
          ...prev.packages[tier],
          [field]: value,
        },
      },
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(makeEmptyEvent());
    setView("form");
  };

  const openEdit = (event) => {
    setEditingId(event.id);
    setForm(JSON.parse(JSON.stringify(event)));
    setView("form");
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(makeEmptyEvent());
    setView("list");
  };

  // Event image as local preview data
  const handleEventImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be below 2MB for this localStorage demo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateEventField("image", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handlePackageImage = (tier, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be below 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updatePackageField(tier, "image", reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Service management
  const addService = (tier) => {
    const current = form.packages[tier].services;

    updatePackageField(tier, "services", [
      ...current,
      {
        category: "",
        description: "",
        pricingType: "fullDay",
        preferredVendors: [],
      },
    ]);
  };

  const updateService = (tier, index, field, value) => {
    const current = form.packages[tier].services;

    const updated = current.map((service, i) => {
      if (i !== index) return service;

      return {
        ...service,
        [field]: value,
        ...(field === "category" ? { preferredVendors: [] } : {}),
      };
    });

    updatePackageField(tier, "services", updated);
  };

  const removeService = (tier, index) => {
    const updated = form.packages[tier].services.filter(
      (_, i) => i !== index
    );

    updatePackageField(tier, "services", updated);
  };

  const toggleVendor = (tier, serviceIndex, vendorId) => {
    const current = form.packages[tier].services;

    const updated = current.map((service, index) => {
      if (index !== serviceIndex) return service;

      const selected = service.preferredVendors.includes(vendorId);

      return {
        ...service,
        preferredVendors: selected
          ? service.preferredVendors.filter((id) => id !== vendorId)
          : [...service.preferredVendors, vendorId],
      };
    });

    updatePackageField(tier, "services", updated);
  };

  const getMatchingVendors = (category) => {
    if (!category) return [];

    return SAMPLE_VENDORS.filter((vendor) =>
      vendor.categories.includes(category)
    );
  };

  // Save event and its three packages together
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Event name is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Event description is required.");
      return;
    }

    for (const tier of EVENT_TIERS) {
      const item = form.packages[tier.value];

      if (!item.name.trim()) {
        toast.error(`Enter ${tier.label} package name.`);
        return;
      }

      if (!item.price || Number(item.price) <= 0) {
        toast.error(`Enter a valid price for ${tier.label}.`);
        return;
      }

      if (item.services.length === 0) {
        toast.error(`Add services to ${tier.label} package.`);
        return;
      }

      if (item.services.some((service) => !service.category)) {
        toast.error(`Select all service categories in ${tier.label}.`);
        return;
      }
    }

    const eventData = {
      ...form,
      id: editingId || `event-${Date.now()}`,
      displayOrder: Number(form.displayOrder) || 1,
      packages: {
        budget: {
          ...form.packages.budget,
          price: Number(form.packages.budget.price),
        },
        standard: {
          ...form.packages.standard,
          price: Number(form.packages.standard.price),
        },
        premium: {
          ...form.packages.premium,
          price: Number(form.packages.premium.price),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingId ? eventData : event
        )
      );

      toast.success("Event updated successfully.");
    } else {
      setEvents((prev) => [eventData, ...prev]);
      toast.success("Event and all three packages created.");
    }

    cancelForm();
  };

  const deleteEvent = (id) => {
    if (!window.confirm("Delete this event and its three packages?")) return;

    setEvents((prev) => prev.filter((event) => event.id !== id));
    toast.success("Event deleted.");
  };

  const toggleStatus = (id) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id) return event;

        return {
          ...event,
          status:
            event.status === "published" ? "unpublished" : "published",
        };
      })
    );

    toast.success("Event visibility updated.");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading events...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">

      {view === "list" ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Events Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage events and their three packages in one place.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700"
            >
              <Plus size={18} />
              Add New Event
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Events" value={stats.total} icon={<CalendarDays size={21} />} />
            <StatCard title="Published" value={stats.published} icon={<CheckCircle size={21} />} />
            <StatCard title="Draft" value={stats.draft} icon={<Clock size={21} />} />
            <StatCard title="Unpublished" value={stats.unpublished} icon={<EyeOff size={21} />} />
          </div>

          {/* FILTERS */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className="field pl-10"
                />
              </div>

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

          {/* EVENTS TABLE */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-semibold text-gray-900">All Events</h2>
              <p className="mt-1 text-xs text-gray-500">
                {filteredEvents.length} events found
              </p>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarDays size={36} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">No events found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first event to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4">Event</th>
                      <th className="px-5 py-4">Packages</th>
                      <th className="px-5 py-4">Display Order</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                              {event.image ? (
                                <img
                                  src={event.image}
                                  alt={event.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <CalendarDays size={20} className="text-gray-400" />
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">{event.name}</p>
                              <p className="max-w-xs truncate text-xs text-gray-500">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-gray-400" />
                            <span>3 Packages</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {event.displayOrder}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={event.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <IconButton
                              title="View"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <Eye size={16} />
                            </IconButton>

                            <IconButton
                              title="Edit Event"
                              onClick={() => openEdit(event)}
                            >
                              <Edit size={16} />
                            </IconButton>

                            <IconButton
                              title="Publish / Unpublish"
                              onClick={() => toggleStatus(event.id)}
                            >
                              {event.status === "published" ? (
                                <EyeOff size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </IconButton>

                            <IconButton
                              title="Delete"
                              danger
                              onClick={() => deleteEvent(event.id)}
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

          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onEdit={() => {
                openEdit(selectedEvent);
                setSelectedEvent(null);
              }}
            />
          )}
        </>
      ) : (
        /* CREATE / EDIT EVENT */
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={cancelForm}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Event" : "Create New Event"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Configure event details and all three packages here.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EVENT DETAILS */}
            <section className="rounded-xl border border-gray-200 bg-white">
              <SectionHeader number="01" title="Event Details" />

              <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                <FormField label="Event Name" required>
                  <input
                    value={form.name}
                    onChange={(e) => updateEventField("name", e.target.value)}
                    placeholder="Example: Wedding"
                    className="field"
                    required
                  />
                </FormField>

                <FormField label="Display Order">
                  <input
                    type="number"
                    min="1"
                    value={form.displayOrder}
                    onChange={(e) =>
                      updateEventField("displayOrder", e.target.value)
                    }
                    className="field"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Description" required>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        updateEventField("description", e.target.value)
                      }
                      placeholder="Describe this event..."
                      className="field"
                      required
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <FormField label="Event Image">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImage}
                      className="field"
                    />
                  </FormField>

                  {form.image && (
                    <img
                      src={form.image}
                      alt="Event preview"
                      className="h-40 w-64 rounded-lg border object-cover"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* THREE PACKAGES */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Package Configuration
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure exactly three packages for this event.
                </p>
              </div>

              {EVENT_TIERS.map((tier, tierIndex) => {
                const item = form.packages[tier.value];

                return (
                  <section
                    key={tier.value}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <div className="flex flex-col justify-between gap-2 border-b border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-semibold text-gray-700">
                          0{tierIndex + 2}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {tier.label}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                        Required Package
                      </span>
                    </div>

                    <div className="space-y-5 p-5">

                      {/* PACKAGE BASIC DETAILS */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField label="Package Name" required>
                          <input
                            value={item.name}
                            onChange={(e) =>
                              updatePackageField(
                                tier.value,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder={`Example: ${tier.label} ${form.name || "Package"}`}
                            className="field"
                          />
                        </FormField>

                        <FormField label="Package Price (₹)" required>
                          <input
                            type="number"
                            min="1"
                            value={item.price}
                            onChange={(e) =>
                              updatePackageField(
                                tier.value,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="Enter package price"
                            className="field"
                          />
                        </FormField>

                        <div className="md:col-span-2">
                          <FormField label="Package Description" required>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) =>
                                updatePackageField(
                                  tier.value,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Describe what this package includes..."
                              className="field"
                            />
                          </FormField>
                        </div>

                        <div className="md:col-span-2">
                          <FormField label="Package Image">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handlePackageImage(tier.value, e)
                              }
                              className="field"
                            />
                          </FormField>

                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="mt-3 h-36 w-56 rounded-lg border object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* PACKAGE SERVICES */}
                      <div className="border-t border-gray-100 pt-5">
                        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Included Services
                            </h4>
                            <p className="text-xs text-gray-500">
                              Add services and choose preferred vendors.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => addService(tier.value)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                          >
                            <PlusCircle size={16} />
                            Add Service
                          </button>
                        </div>

                        {item.services.length === 0 && (
                          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                            <Layers className="mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              No services added yet.
                            </p>
                          </div>
                        )}

                        <div className="space-y-4">
                          {item.services.map((service, index) => {
                            const matchingVendors = getMatchingVendors(
                              service.category
                            );

                            return (
                              <div
                                key={index}
                                className="space-y-4 rounded-lg border border-gray-200 p-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-semibold text-gray-800">
                                    Service {index + 1}
                                  </h5>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeService(tier.value, index)
                                    }
                                    className="flex items-center gap-1 text-xs text-red-600"
                                  >
                                    <MinusCircle size={15} />
                                    Remove
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <FormField label="Service Category" required>
                                    <select
                                      value={service.category}
                                      onChange={(e) =>
                                        updateService(
                                          tier.value,
                                          index,
                                          "category",
                                          e.target.value
                                        )
                                      }
                                      className="field"
                                    >
                                      <option value="">Select service</option>
                                      {SERVICE_CATEGORIES.map((category) => (
                                        <option key={category}>
                                          {category}
                                        </option>
                                      ))}
                                    </select>
                                  </FormField>

                                  <FormField label="Pricing Type">
                                    <select
                                      value={service.pricingType}
                                      onChange={(e) =>
                                        updateService(
                                          tier.value,
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

                                  <div className="md:col-span-2">
                                    <FormField label="Service Description">
                                      <input
                                        value={service.description}
                                        onChange={(e) =>
                                          updateService(
                                            tier.value,
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
                                </div>

                                {/* PREFERRED VENDORS */}
                                <div className="rounded-lg bg-gray-50 p-4">
                                  <div className="mb-3 flex items-center justify-between">
                                    <div>
                                      <h5 className="text-sm font-semibold text-gray-800">
                                        Preferred Vendors
                                      </h5>
                                      <p className="text-xs text-gray-500">
                                        {service.category
                                          ? `Vendors for ${service.category}`
                                          : "Select a category first"}
                                      </p>
                                    </div>

                                    <span className="text-xs text-gray-600">
                                      {service.preferredVendors.length} selected
                                    </span>
                                  </div>

                                  {!service.category ? (
                                    <p className="text-xs text-gray-500">
                                      Choose a service category to view matching vendors.
                                    </p>
                                  ) : matchingVendors.length === 0 ? (
                                    <p className="text-xs text-amber-700">
                                      No matching sample vendors found.
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                      {matchingVendors.map((vendor) => (
                                        <label
                                          key={vendor.id}
                                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={service.preferredVendors.includes(
                                              vendor.id
                                            )}
                                            onChange={() =>
                                              toggleVendor(
                                                tier.value,
                                                index,
                                                vendor.id
                                              )
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
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {/* EVENT STATUS */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">
                Event Publishing
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Publish this event after configuring all three packages.
              </p>

              <select
                value={form.status}
                onChange={(e) =>
                  updateEventField("status", e.target.value)
                }
                className="field mt-4 max-w-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </section>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700"
              >
                <Save size={17} />
                {editingId ? "Update Event" : "Create Event & Packages"}
              </button>
            </div>
          </form>
        </>
      )}

      <style>{`
        .field {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 11px 13px;
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

// REUSABLE COMPONENTS

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

function SectionHeader({ number, title }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 p-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold">
        {number}
      </span>
      <h2 className="font-semibold text-gray-900">{title}</h2>
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

function StatusBadge({ status }) {
  const styles = {
    published: "bg-green-50 text-green-700",
    draft: "bg-amber-50 text-amber-700",
    unpublished: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
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

function EventDetails({ event, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3">
      <div className="my-5 w-full max-w-3xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {event.name}
            </h2>
            <p className="text-xs text-gray-500">Event details and packages</p>
          </div>

          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
          {event.image && (
            <img
              src={event.image}
              alt={event.name}
              className="h-48 w-full rounded-lg object-cover"
            />
          )}

          <p className="text-sm text-gray-600">{event.description}</p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {EVENT_TIERS.map((tier) => {
              const item = event.packages[tier.value];

              return (
                <div key={tier.value} className="rounded-lg border p-4">
                  <p className="text-xs text-gray-500">{tier.label}</p>
                  <h3 className="mt-1 font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-lg font-bold">
                    {money(item.price)}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {item.services.length} services
                  </p>
                </div>
              );
            })}
          </div>

          {EVENT_TIERS.map((tier) => {
            const item = event.packages[tier.value];

            return (
              <div key={tier.value} className="rounded-lg border p-4">
                <h3 className="font-semibold text-gray-900">
                  {tier.label} – {item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {item.description}
                </p>

                <div className="mt-3 space-y-2">
                  {item.services.map((service, index) => (
                    <div key={index} className="rounded-md bg-gray-50 p-3">
                      <p className="text-sm font-medium text-gray-800">
                        {service.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {service.preferredVendors.length} preferred vendors
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 border-t p-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Edit Event
          </button>
        </div>
      </div>
    </div>
  );
}
