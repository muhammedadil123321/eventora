import { Link } from "react-router-dom";

const eventCategories = [
  {
    title: "Wedding",
    description: "Make your special day unforgettable.",
    icon: "💍",
  },
  {
    title: "Engagement",
    description: "Celebrate the beginning of your journey.",
    icon: "💐",
  },
  {
    title: "Birthday",
    description: "Create memorable birthday celebrations.",
    icon: "🎂",
  },
  {
    title: "Corporate",
    description: "Professional planning for business events.",
    icon: "🏢",
  },
  {
    title: "Private Party",
    description: "Bring your personal celebrations to life.",
    icon: "🎉",
  },
];

const services = [
  {
    title: "Photography",
    description: "Capture every special moment.",
    icon: "📸",
  },
  {
    title: "Decoration",
    description: "Beautiful setups for your event.",
    icon: "🌸",
  },
  {
    title: "Catering",
    description: "Delicious food for your guests.",
    icon: "🍽️",
  },
  {
    title: "Venue",
    description: "Find a suitable space for your celebration.",
    icon: "🏛️",
  },
];

const packages = [
  {
    title: "Budget Friendly",
    description: "Essential services for a beautiful event.",
    features: ["Essential event services", "Flexible service selection"],
  },
  {
    title: "Standard",
    description: "A balanced package for memorable celebrations.",
    features: ["Popular event services", "More customization options"],
    featured: true,
  },
  {
    title: "Premium",
    description: "A complete experience for your special occasion.",
    features: ["Premium service options", "Personalized event planning"],
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Event",
    description: "Select your event type and the services you need.",
  },
  {
    number: "02",
    title: "Submit a Request",
    description: "Share your date, venue, guest count, and budget.",
  },
  {
    number: "03",
    title: "Receive a Quotation",
    description: "Our Admin team prepares a quotation for your request.",
  },
  {
    number: "04",
    title: "Confirm Your Booking",
    description: "Review the quotation and wait for booking confirmation.",
  },
];

export default function CustomerHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Eventora
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="#events" className="text-sm text-gray-600 hover:text-gray-900">
              Events
            </a>
            <a href="#services" className="text-sm text-gray-600 hover:text-gray-900">
              Services
            </a>
            <a href="#packages" className="text-sm text-gray-600 hover:text-gray-900">
              Packages
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:inline-flex"
            >
              Login
            </Link>

            <Link
              to="/customer/signup"
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600">
              Your Events, Thoughtfully Planned
            </span>

            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Every Celebration
              <span className="block text-gray-500">Starts With a Plan.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
              From weddings to intimate gatherings, Eventora helps you discover
              services, request quotations, and manage your event in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/customer/signup"
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Plan Your Event
              </Link>

              <a
                href="#events"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
              >
                Explore Events
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-gray-200 pt-6">
              <div>
                <p className="text-xl font-bold">5+</p>
                <p className="mt-1 text-xs text-gray-500">Event Categories</p>
              </div>
              <div>
                <p className="text-xl font-bold">Flexible</p>
                <p className="mt-1 text-xs text-gray-500">Service Selection</p>
              </div>
              <div>
                <p className="text-xl font-bold">One Place</p>
                <p className="mt-1 text-xs text-gray-500">Booking Management</p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-gray-200 p-8 sm:min-h-[460px]">
              <div className="max-w-sm text-center">
                <div className="text-7xl">💐</div>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-gray-600">
                  Your Moment. Your Celebration.
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  Let’s Make It Memorable
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Discover event services and create a celebration that feels
                  uniquely yours.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:-left-5">
              <p className="text-xs text-gray-500">Planning made simpler</p>
              <p className="mt-1 text-sm font-semibold">Services · Quotations · Bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section id="events" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Find Your Occasion
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              What Are You Celebrating?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
              Choose an event type to start exploring services and planning
              options.
            </p>
          </div>

          <Link
            to="/customer/signup"
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            Start Planning →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {eventCategories.map((event) => (
            <Link
              key={event.title}
              to="/customer/signup"
              className="rounded-2xl border border-gray-200 p-5 transition hover:-translate-y-1 hover:border-gray-400 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {event.icon}
              </div>
              <h3 className="mt-5 font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {event.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Everything You Need for Your Event
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Explore services and select the options that fit your event,
              preferences, and budget.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="text-3xl">{service.icon}</div>
                <h3 className="mt-5 font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Event Packages
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Choose a Package That Fits
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
            Start with a package tier. Your final quotation will be prepared
            based on your selected services and event requirements.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className={`rounded-2xl border p-7 ${
                pkg.featured
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              {pkg.featured && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                  Popular Choice
                </span>
              )}

              <h3 className="mt-4 text-xl font-bold">{pkg.title}</h3>
              <p
                className={`mt-3 text-sm leading-6 ${
                  pkg.featured ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {pkg.description}
              </p>

              <ul className="mt-6 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <span>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/customer/signup"
                className={`mt-8 inline-flex w-full justify-center rounded-lg px-5 py-3 text-sm font-semibold ${
                  pkg.featured
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Choose Package
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Simple Process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              How Eventora Works
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="text-sm font-bold text-gray-400">{step.number}</p>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="rounded-3xl bg-gray-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Plan Your Next Event?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-300">
            Create your customer account and submit your event requirements.
            Our team will help you move forward with a quotation.
          </p>

          <Link
            to="/customer/signup"
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Create Customer Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-lg font-bold">Eventora</p>
            <p className="mt-1 text-xs text-gray-500">
              Event planning and booking management.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-500">
            <a href="#events" className="hover:text-gray-900">
              Events
            </a>
            <a href="#services" className="hover:text-gray-900">
              Services
            </a>
            <a href="#packages" className="hover:text-gray-900">
              Packages
            </a>
            <Link to="/login" className="hover:text-gray-900">
              Login
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Eventora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}