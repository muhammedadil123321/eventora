import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CustomerNavbar from "../components/CustomerNavbar";
import ChooseEvents from "./ChooseEvents";
import About from "./About";
import CustomerFooter from "../components/CustomerFooter";


/* ------------------------------------------------------------------ */
/* Theme (same tokens as CustomerNavbar)                                */
/*   Ink navy  #0F1729  – dark surfaces                                 */
/*   Gold      #D8B068  – buttons, accents, hover                       */
/*   White     #FFFFFF  – text on navy                                  */
/* Fonts: Cormorant Garamond (headings) + DM Sans (body)                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Content – edit images / copy here                                    */
/* Put your photos in: client/public/images/home/                       */
/* ------------------------------------------------------------------ */
const HERO_COPY = {
  heading: ["Your dream.", "Your day.", "Your story."],
  description:
    "Every special moment deserves to be remembered. Choose your event, pick a package, and tell us what you need. Our team reviews your request and prepares a transparent, itemized quotation.",
};

const EVENTS = [
  {
    id: "wedding",
    label: "Wedding",
    tagline: "Timeless celebrations of love",
    image: "/images/home/wedding.jpg",
  },
  {
    id: "engagement",
    label: "Engagement",
    tagline: "The beginning of your story",
    image: "/images/home/engagement.jpg",
  },
  {
    id: "birthday",
    label: "Birthday",
    tagline: "Milestones worth remembering",
    image: "/images/home/birthday.jpg",
  },
  {
    id: "housewarming",
    label: "Housewarming",
    tagline: "Welcome every blessing home",
    image: "/images/home/housewarming.jpg",
  },
  {
    id: "corporate",
    label: "Corporate Event",
    tagline: "Polished gatherings with purpose",
    image: "/images/home/corporate-event.jpg",
  },
  {
    id: "party",
    label: "Private Party",
    tagline: "Intimate nights, unforgettable moments",
    image: "/images/home/private-party.jpg",
  },
];

const ROTATE_MS = 7000;

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

// A soft gold glow on navy sits under every photo, so the hero
// still looks designed if an image file is missing.
const CinematicImage = ({ src, alt = "", eager = false }) => {
  const [failed, setFailed] = useState(false);

  return (
    <>
      <div className="absolute inset-0 bg-[#0F1729] bg-[radial-gradient(ellipse_at_75%_20%,rgba(216,176,104,0.25),transparent_60%)]" />
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </>
  );
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
const CustomerHome = () => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [offset, setOffset] = useState(0);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Gentle parallax
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onScroll = () => setOffset(Math.min(window.scrollY, 800) * 0.25);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slow auto-rotation (timer restarts whenever the visitor picks an event)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setInterval(
      () => setActive((i) => (i + 1) % EVENTS.length),
      ROTATE_MS
    );
    return () => clearInterval(timer);
  }, [active]);

  const enter = (delay) => ({
    style: { transitionDelay: `${delay}ms` },
    cls: `transition-all duration-1000 ease-out motion-reduce:transition-none ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });

  const h = enter(0);
  const p = enter(200);
  const b = enter(400);
  const s = enter(500);

  return (
    <main className="bg-[#0F1729] font-['DM_Sans']">
      <CustomerNavbar />

      <section className="relative min-h-screen overflow-hidden">
        {/* Background photos (cross-fade + parallax) */}
        <div
          className="absolute inset-0"
          style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.1)` }}
        >
          {EVENTS.map((event, i) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <CinematicImage src={event.image} eager={i === 0} />
            </div>
          ))}
        </div>

        {/* Overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1729] via-[#0F1729]/45 to-[#0F1729]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1729]/70 via-[#0F1729]/20 to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-end gap-12 px-6 pb-12 pt-36 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20 lg:px-10 lg:pb-20">
          {/* Left: message */}
          <div>
            <h1
              style={h.style}
              className={`font-['Cormorant_Garamond'] text-6xl font-medium leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl xl:text-9xl ${h.cls}`}
            >
              {HERO_COPY.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p
              style={p.style}
              className={`mt-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg ${p.cls}`}
            >
              {HERO_COPY.description}
            </p>

            <div
              style={b.style}
              className={`mt-10 flex flex-col gap-3 sm:flex-row ${b.cls}`}
            >
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D8B068] px-8 py-4 text-sm font-semibold text-[#0F1729] transition-colors duration-300 hover:bg-white"
              >
                Explore events
                <ArrowRight size={18} strokeWidth={1.75} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border border-white/50 px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:border-[#D8B068] hover:text-[#D8B068]"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Right: event selector */}
          <div style={s.style} className={s.cls}>
            {/* Desktop: vertical list */}
            <div
              role="tablist"
              aria-label="Choose an event"
              className="hidden border-l border-white/20 lg:block"
            >
              {EVENTS.map((event, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={event.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className="group relative block w-full py-3 pl-8 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B068]"
                  >
                    <span
                      className={`absolute -left-px top-0 w-0.5 bg-[#D8B068] transition-all duration-500 ${
                        isActive ? "h-full opacity-100" : "h-0 opacity-0"
                      }`}
                    />
                    <span
                      className={`block font-['Cormorant_Garamond'] text-3xl font-medium transition-colors duration-300 xl:text-4xl ${
                        isActive
                          ? "text-[#D8B068]"
                          : "text-white/55 group-hover:text-white"
                      }`}
                    >
                      {event.label}
                    </span>
                    <span
                      className={`block overflow-hidden text-sm text-white/70 transition-all duration-500 ${
                        isActive ? "mt-1 max-h-8 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {event.tagline}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile / tablet: chips */}
            <div className="border-t border-white/20 pt-6 lg:hidden">
              <div
                role="tablist"
                aria-label="Choose an event"
                className="flex flex-wrap gap-2"
              >
                {EVENTS.map((event, i) => (
                  <button
                    key={event.id}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B068] ${
                      i === active
                        ? "border-[#D8B068] bg-[#D8B068] text-[#0F1729]"
                        : "border-white/30 text-white hover:border-[#D8B068] hover:text-[#D8B068]"
                    }`}
                  >
                    {event.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/70">
                {EVENTS[active].tagline}
              </p>
            </div>
          </div>
        </div>

      </section>

      <ChooseEvents/>
      <About/>
      <CustomerFooter/>

    </main>
  );
};

export default CustomerHome;