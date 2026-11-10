import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Cake,
  Gem,
  Heart,
  Home,
  PartyPopper,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Theme (same tokens as CustomerNavbar / CustomerHome)                 */
/*   Ink navy #0F1729 · Gold #D8B068 · White · Slate #4B5568            */
/*   Line #E5E3EA · Pearl #F6F5F8                                        */
/* Fonts: Cormorant Garamond (headings) + DM Sans (body)                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Content – photos go in: client/public/images/home/                   */
/* (same files the hero uses, so no extra photos are needed)            */
/* ------------------------------------------------------------------ */
const EVENT_TYPES = [
  {
    id: "wedding",
    label: "Wedding",
    tagline: "Timeless celebrations of love",
    image: "/images/home/wedding.jpg",
    icon: Heart,
  },
  {
    id: "engagement",
    label: "Engagement",
    tagline: "The beginning of your story",
    image: "/images/home/engagement.jpg",
    icon: Gem,
  },
  {
    id: "birthday",
    label: "Birthday",
    tagline: "Milestones worth remembering",
    image: "/images/home/birthday.jpg",
    icon: Cake,
  },
  {
    id: "housewarming",
    label: "Housewarming",
    tagline: "Welcome every blessing home",
    image: "/images/home/housewarming.jpg",
    icon: Home,
  },
  {
    id: "corporate",
    label: "Corporate Event",
    tagline: "Polished gatherings with purpose",
    image: "/images/home/corporate-event.jpg",
    icon: Briefcase,
  },
  {
    id: "party",
    label: "Private Party",
    tagline: "Intimate nights, unforgettable moments",
    image: "/images/home/private-party.jpg",
    icon: PartyPopper,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

// Fade + slide up when scrolled into view (runs once)
const Reveal = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Photo with a designed navy + gold fallback (icon) if the file is missing
const EventPhoto = ({ event }) => {
  const [failed, setFailed] = useState(false);
  const Icon = event.icon;

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center bg-[#0F1729] bg-[radial-gradient(ellipse_at_50%_30%,rgba(216,176,104,0.28),transparent_65%)]">
        <Icon size={96} strokeWidth={0.75} className="text-[#D8B068]/40" />
      </div>
      {!failed && (
        <img
          src={event.image}
          alt={event.label}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110 motion-reduce:transition-none"
        />
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */
const ChooseEvents = () => {
  return (
    <section
      id="choose-events"
      className="scroll-mt-20 bg-white py-20 font-['DM_Sans'] sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="font-['Cormorant_Garamond'] text-5xl font-medium leading-[1.02] tracking-tight text-[#0F1729] sm:text-6xl lg:text-7xl">
              Choose your event
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#4B5568] sm:text-lg">
              From intimate gatherings to grand celebrations, select the
              occasion you are planning and we will take it from there.
            </p>
          </div>

          <Link
            to="/events"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-[#0F1729] transition-colors duration-300 hover:text-[#D8B068] sm:self-auto"
          >
            View all events
            <ArrowRight
              size={18}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>

        {/* Cards: the middle column sits lower on desktop for an editorial rhythm */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-8 lg:pb-14">
          {EVENT_TYPES.map((event, i) => {
            const Icon = event.icon;
            const isMiddleColumn = i % 3 === 1;

            return (
              <Reveal
                key={event.id}
                delay={(i % 3) * 120}
                className={isMiddleColumn ? "lg:mt-14" : ""}
              >
                <Link
                  to={`/events?type=${event.id}`}
                  aria-label={`Plan a ${event.label}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-[#0F1729] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B068] focus-visible:ring-offset-2"
                >
                  <EventPhoto event={event} />

                  {/* Legibility gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1729]/90 via-[#0F1729]/25 to-[#0F1729]/10" />

                  {/* Top row: index + icon */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
                    <span className="font-['Cormorant_Garamond'] text-2xl font-medium text-white/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 text-white transition-colors duration-300 group-hover:border-[#D8B068] group-hover:bg-[#D8B068] group-hover:text-[#0F1729]">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                  </div>

                  {/* Bottom: name + reveal details */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <h3 className="font-['Cormorant_Garamond'] text-4xl font-medium leading-none text-white">
                      {event.label}
                    </h3>

                    {/* Always visible on touch screens; revealed on hover on desktop */}
                    <div className="overflow-hidden transition-all duration-500 ease-out lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-24 lg:group-hover:opacity-100 lg:group-focus-visible:max-h-24 lg:group-focus-visible:opacity-100">
                      <p className="mt-3 text-sm leading-relaxed text-white/80">
                        {event.tagline}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#D8B068]">
                        Plan this event
                        <ArrowRight
                          size={16}
                          strokeWidth={1.75}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>

                  {/* Gold underline that draws in on hover */}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#D8B068] transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChooseEvents;