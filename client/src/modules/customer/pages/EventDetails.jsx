import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import CustomerFooter from "../components/CustomerFooter";
import { events, packages } from "../data/customerData";

const availableServices = [
  "Catering",
  "Decoration",
  "Photography",
  "Sound",
  "DJ",
];

export default function EventDetails() {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();

  const tier = searchParams.get("tier") || "CLASSIC";
  const event = events.find((item) => item.id === eventId);

  const selectedPackage = packages[eventId]?.find(
    (pkg) => pkg.tier === tier
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    city: "",
    guests: "",
    notes: "",
  });

  const [selectedServices, setSelectedServices] = useState(
    selectedPackage
      ? selectedPackage.services.map((service) => ({
          name: service,
          tier,
        }))
      : []
  );

  if (!event || !selectedPackage) {
    return <div className="p-20 text-center">Package not found.</div>;
  }

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleService = (name) => {
    setSelectedServices((previous) =>
      previous.some((service) => service.name === name)
        ? previous.filter((service) => service.name !== name)
        : [...previous, { name, tier: "CLASSIC" }]
    );
  };

  const updateServiceTier = (name, value) => {
    setSelectedServices((previous) =>
      previous.map((service) =>
        service.name === name ? { ...service, tier: value } : service
      )
    );
  };

  return (
    <>
      <CustomerNavbar />

      <section className="bg-gray-50 px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">Event Details</h1>
          <p className="mt-2 text-gray-500">
            Provide your event information and customize your services.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo only: Booking functionality is not enabled yet.");
            }}
            className="mt-8 space-y-8"
          >
            {/* Selected Package */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Selected Package</h2>
              <p className="mt-3 text-gray-600">
                {event.name} - {tier}
              </p>
              <p className="mt-2 text-2xl font-bold">
                ₹{selectedPackage.price.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Customer Details */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Customer Information</h2>

              <div className="grid gap-5 md:grid-cols-2">
                {[
                  ["fullName", "Full Name", "text"],
                  ["email", "Email Address", "email"],
                  ["phone", "Phone Number", "tel"],
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="mb-2 block text-sm font-medium">
                      {label}
                    </label>
                    <input
                      required
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={updateField}
                      className="w-full rounded-lg border p-3 outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Event Information */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Event Information</h2>

              <div className="grid gap-5 md:grid-cols-2">
                {[
                  ["date", "Event Date", "date"],
                  ["startTime", "Start Time", "time"],
                  ["endTime", "End Time", "time"],
                  ["guests", "Expected Guests", "number"],
                  ["venue", "Venue", "text"],
                  ["city", "City", "text"],
                ].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="mb-2 block text-sm font-medium">
                      {label}
                    </label>
                    <input
                      required
                      name={name}
                      type={type}
                      min={type === "number" ? "1" : undefined}
                      value={form[name]}
                      onChange={updateField}
                      className="w-full rounded-lg border p-3 outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Customize Your Services</h2>

              <p className="mt-2 text-sm text-gray-500">
                Add or remove services and select a tier for each service.
              </p>

              <div className="mt-6 space-y-4">
                {availableServices.map((service) => {
                  const selected = selectedServices.find(
                    (item) => item.name === service
                  );

                  return (
                    <div
                      key={service}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4"
                    >
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleService(service)}
                          className="h-4 w-4 accent-amber-500"
                        />
                        <span className="font-medium">{service}</span>
                      </label>

                      {selected && (
                        <select
                          value={selected.tier}
                          onChange={(e) =>
                            updateServiceTier(service, e.target.value)
                          }
                          className="rounded-lg border p-2"
                        >
                          <option value="CLASSIC">CLASSIC</option>
                          <option value="ROYAL">ROYAL</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold">Additional Requirements</h2>
              <textarea
                name="notes"
                value={form.notes}
                onChange={updateField}
                rows="4"
                placeholder="Tell us about your special requirements..."
                className="w-full rounded-lg border p-3 outline-none focus:border-amber-500"
              />
            </div>

            {/* Price Summary */}
            <div className="rounded-2xl bg-gray-950 p-6 text-white">
              <h2 className="text-xl font-bold">Price Summary</h2>
              <div className="mt-4 flex justify-between">
                <span>Base Package</span>
                <span>
                  ₹{selectedPackage.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-700 pt-4">
                <span>Selected Services</span>
                <span>{selectedServices.length}</span>
              </div>

              <p className="mt-4 text-sm text-gray-400">
                Additional service prices will be calculated when the real
                pricing system is connected.
              </p>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-amber-500 px-6 py-4 font-semibold text-white hover:bg-amber-600"
              >
                Demo Form Submit
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Demo only. No actual booking or payment will happen.
              </p>
            </div>
          </form>
        </div>
      </section>

      <CustomerFooter />
    </>
  );
}