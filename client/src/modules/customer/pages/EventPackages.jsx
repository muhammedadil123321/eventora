import { Link, useParams } from "react-router-dom";
import CustomerNavbar from "../components/CustomerNavbar";
import CustomerFooter from "../components/CustomerFooter";
import { events, packages } from "../data/customerData";

export default function EventPackages() {
  const { eventId } = useParams();

  const event = events.find((item) => item.id === eventId);
  const eventPackages = packages[eventId];

  if (!event || !eventPackages) {
    return <div className="p-20 text-center">Event not found.</div>;
  }

  return (
    <>
      <CustomerNavbar />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-amber-600">
              {event.name}
            </p>
            <h1 className="mt-3 text-4xl font-bold">Choose Your Package</h1>
            <p className="mt-4 text-gray-500">{event.description}</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {eventPackages.map((pkg) => (
              <div
                key={pkg.tier}
                className={`rounded-2xl border p-8 ${
                  pkg.tier === "ROYAL"
                    ? "border-amber-400 bg-gray-950 text-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h2
                  className={`text-2xl font-bold ${
                    pkg.tier === "ROYAL" ? "text-amber-400" : ""
                  }`}
                >
                  {pkg.tier}
                </h2>

                <p
                  className={`mt-3 ${
                    pkg.tier === "ROYAL" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {pkg.description}
                </p>

                <h3 className="mt-7 text-3xl font-bold">
                  ₹{pkg.price.toLocaleString("en-IN")}
                </h3>

                <div className="mt-7">
                  <h4 className="font-semibold">Included Services</h4>

                  <ul className="mt-4 space-y-3">
                    {pkg.services.map((service) => (
                      <li key={service} className="text-sm">
                        ✓ {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/customer/events/${eventId}/details?tier=${pkg.tier}`}
                  className="mt-8 block rounded-full bg-amber-500 px-6 py-3 text-center font-semibold text-white hover:bg-amber-600"
                >
                  Select {pkg.tier} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CustomerFooter />
    </>
  );
}