import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  FileText,
  Gem,
  Heart,
  Sparkles,
} from "lucide-react";
import CustomerNavbar from "../components/CustomerNavbar";

/* ------------------------------------------------------------------ */
/* Theme (same tokens as the rest of the customer UI)                   */
/*   Ink navy #0F1729 · Gold #D8B068 · White · Slate #4B5568            */
/*   Line #E5E3EA · Pearl #F6F5F8                                        */
/* Fonts: Cormorant Garamond (headings) + DM Sans (body)                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Content – edit copy here. Photos go in: client/public/images/about/  */
/* Every photo has a designed fallback, so nothing breaks if missing.   */
/* ------------------------------------------------------------------ */
const HERO = {
  image: "/images/about/about-hero.jpg",
  heading: ["We plan the", "moments you will", "remember."],
  description:
    "Eventora is a premium event management platform. From the first idea to the final detail, we help you choose, plan and celebrate with clarity and care.",
};

const STORY = {
  imageLarge: "/images/about/about-story-1.jpg",
  imageSmall: "/images/about/about-story-2.jpg",
  heading: "Our story",
  paragraphs: [
    "Every special moment deserves to be remembered. We started Eventora so that planning a celebration feels as joyful as the celebration itself.",
    "Whether it is a wedding, an engagement, a birthday, a housewarming, a corporate event or a private party, our team brings the same care, taste and attention to every occasion.",
  ],
};

const STEPS = [
  {
    title: "Choose your event",
    text: "Select the occasion you are planning: Wedding, Engagement, Birthday, Housewarming, Corporate Event or Private Party.",
    image: "/images/about/about-step-1.jpg",
    icon: CalendarDays,
  },
  {
    title: "Pick a package",
    text: "Choose Classic for a light, elegant look, or Royal for a grand style finished with gold.",
    image: "/images/about/about-step-2.jpg",
    icon: Gem,
  },
  {
    title: "Tell us what you need",
    text: "Share your requirements, preferences and any special requests, so the plan feels like yours.",
    image: "/images/about/about-step-3.jpg",
    icon: ClipboardList,
  },
  {
    title: "Receive your quotation",
    text: "Our team reviews your request and prepares a transparent, itemized quotation.",
    image: "/images/about/about-step-4.jpg",
    icon: FileText,
  },
];

const VALUES = [
  {
    title: "Transparent by design",
    text: "Every quotation is itemized, so you always know exactly what you are choosing.",
    image: "/images/about/about-value-1.jpg",
    icon: FileText,
  },
  {
    title: "Personal from the start",
    text: "Tell us what you need and our team shapes the plan around you, not a template.",
    image: "/images/about/about-value-2.jpg",
    icon: Heart,
  },
  {
    title: "Detail in everything",
    text: "We care about the small things that turn a good event into one that feels like yours.",
    image: "/images/about/about-value-3.jpg",
    icon: Sparkles,
  },
];

const VALUE_ROTATE_MS = 5500;

const STEP_ROTATE_MS = 6000;

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Contact details live in the footer (id="contact"), so there is no /contact page.
const scrollToContact = () => {
  const el = document.getElementById("contact");
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
};

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

// Photo that fills its parent. If the file is missing, a navy + gold
// placeholder (with an optional icon) is shown instead.
const Photo = ({ src, alt = "", icon: Icon, eager = false, className = "" }) => {
  const [failed, setFailed] = useState(false);

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center bg-[#0F1729] bg-[radial-gradient(ellipse_at_50%_30%,rgba(216,176,104,0.28),transparent_65%)]">
        {Icon && <Icon size={72} strokeWidth={0.75} className="text-[#D8B068]/40" />}
      </div>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */
const AboutHero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const enter = (delay) => ({
    style: { transitionDelay: `${delay}ms` },
    cls: `transition-all duration-1000 ease-out motion-reduce:transition-none ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });
  const h = enter(0);
  const p = enter(200);

  return (
    <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-[#0F1729]">
      <Photo src={HERO.image} eager />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1729] via-[#0F1729]/50 to-[#0F1729]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1729]/70 via-[#0F1729]/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-40 lg:px-10 lg:pb-24">
        <h1
          style={h.style}
          className={`font-['Cormorant_Garamond'] text-6xl font-medium leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-8xl ${h.cls}`}
        >
          {HERO.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          style={p.style}
          className={`mt-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg ${p.cls}`}
        >
          {HERO.description}
        </p>
      </div>
    </section>
  );
};

const Story = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Gentle mouse parallax on the two photos (desktop only, skipped if reduced motion)
  const handleMove = (e) => {
    if (prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        {/* Photos */}
        <Reveal>
          <div
            onMouseMove={handleMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            className="relative mx-auto mb-12 w-full max-w-md lg:max-w-none"
          >
            <div
              className="group relative aspect-[4/5] w-[80%] overflow-hidden rounded-lg transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${tilt.x * -8}px, ${tilt.y * -8}px, 0)`,
              }}
            >
              <Photo
                src={STORY.imageLarge}
                alt="Eventora celebration"
                className="transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
            </div>

            <div
              className="group absolute -bottom-12 right-0 aspect-[4/5] w-[48%] overflow-hidden rounded-lg border-8 border-white shadow-[0_12px_32px_rgba(15,23,41,0.12)] transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${tilt.x * 14}px, ${tilt.y * 14}px, 0)`,
              }}
            >
              <Photo
                src={STORY.imageSmall}
                alt="Event detail"
                className="transition-transform duration-[900ms] ease-out group-hover:scale-110"
              />
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <Reveal delay={150}>
          <h2 className="font-['Cormorant_Garamond'] text-5xl font-medium leading-[1.02] tracking-tight text-[#0F1729] sm:text-6xl lg:text-7xl">
            {STORY.heading}
          </h2>
          <div className="mt-8 space-y-5">
            {STORY.paragraphs.map((text) => (
              <p
                key={text}
                className="max-w-xl text-base leading-relaxed text-[#4B5568] sm:text-lg"
              >
                {text}
              </p>
            ))}
          </div>
          <Link
            to="/events"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#0F1729] transition-colors duration-300 hover:text-[#D8B068]"
          >
            Explore our events
            <ArrowRight
              size={18}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

/* Dark navy section: every text, border and icon colour is tuned for #0F1729 */
const HowWeWork = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance; pauses while the visitor is hovering, restarts on every change
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const timer = setInterval(
      () => setActive((i) => (i + 1) % STEPS.length),
      STEP_ROTATE_MS
    );
    return () => clearInterval(timer);
  }, [active, paused]);

  return (
    <section
      className="bg-[#0F1729] py-20 sm:py-24 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="font-['Cormorant_Garamond'] text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            How Eventora works
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
            Four simple steps from first idea to a clear, itemized quotation.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          {/* Photo */}
          <Reveal className="lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-[#0F1729]">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 transition-opacity duration-[1000ms] ease-in-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Photo
                    src={step.image}
                    alt={i === active ? step.title : ""}
                    icon={step.icon}
                    className={`transition-transform duration-[7000ms] ease-out motion-reduce:transition-none ${
                      i === active ? "scale-100" : "scale-110"
                    }`}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1729]/60 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 font-['Cormorant_Garamond'] text-5xl font-medium text-[#D8B068]">
                {String(active + 1).padStart(2, "0")}
              </span>
            </div>
          </Reveal>

          {/* Steps */}
          <Reveal delay={150} className="lg:order-1">
            <ul role="tablist" aria-label="How Eventora works" className="border-t border-white/15">
              {STEPS.map((step, i) => {
                const isActive = i === active;
                const Icon = step.icon;
                return (
                  <li key={step.title} className="border-b border-white/15">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group relative flex w-full items-center gap-5 py-6 pl-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B068]"
                    >
                      <span
                        className={`absolute left-0 top-0 w-0.5 bg-[#D8B068] transition-all duration-500 ${
                          isActive ? "h-full opacity-100" : "h-0 opacity-0"
                        }`}
                      />
                      <span
                        className={`font-['Cormorant_Garamond'] text-3xl font-medium transition-colors duration-300 sm:text-4xl ${
                          isActive ? "text-white" : "text-white/50 group-hover:text-white"
                        }`}
                      >
                        {step.title}
                      </span>
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className={`ml-auto shrink-0 transition-colors duration-300 ${
                          isActive ? "text-[#D8B068]" : "text-white/25 group-hover:text-white/60"
                        }`}
                      />
                    </button>

                    <div
                      className={`grid pl-6 transition-all duration-500 ease-out ${
                        isActive ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden text-base leading-relaxed text-white/70">
                        {step.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Values = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance; pauses while the visitor is hovering, restarts on every change
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const timer = setInterval(
      () => setActive((i) => (i + 1) % VALUES.length),
      VALUE_ROTATE_MS
    );
    return () => clearInterval(timer);
  }, [active, paused]);

  return (
    <section
      className="bg-[#0F1729] py-20 sm:py-24 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="font-['Cormorant_Garamond'] text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            What we stand for
          </h2>
          <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            The principles behind every celebration we plan.
          </p>
        </Reveal>

        {/* Expanding panels: horizontal on desktop, stacked on mobile */}
        <Reveal delay={150} className="mt-12 lg:mt-16">
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
            {VALUES.map((value, i) => {
              const isActive = i === active;
              const Icon = value.icon;
              const number = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={value.title}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={value.title}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  className={`relative min-w-0 cursor-pointer overflow-hidden rounded-lg border bg-[#0F1729] transition-all duration-700 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B068] motion-reduce:transition-none lg:h-[34rem] ${
                    isActive
                      ? "h-[26rem] border-[#D8B068] lg:flex-[3_1_0%]"
                      : "h-24 border-white/15 hover:border-[#D8B068]/60 lg:flex-[1_1_0%]"
                  }`}
                >
                  {/* Photo */}
                  <Photo
                    src={value.image}
                    icon={value.icon}
                    alt={isActive ? value.title : ""}
                    className={`transition-transform duration-[1400ms] ease-out motion-reduce:transition-none ${
                      isActive ? "scale-100" : "scale-110"
                    }`}
                  />

                  {/* Overlays: darker when collapsed, readable gradient when open */}
                  <div
                    className={`absolute inset-0 bg-[#0F1729]/70 transition-opacity duration-700 ${
                      isActive ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-[#0F1729]/95 via-[#0F1729]/35 to-[#0F1729]/10 transition-opacity duration-700 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Collapsed label */}
                  <div
                    className={`absolute inset-0 flex items-center gap-4 px-6 transition-opacity duration-500 ${
                      isActive
                        ? "pointer-events-none opacity-0"
                        : "opacity-100 delay-300"
                    }`}
                  >
                    <span className="font-['Cormorant_Garamond'] text-2xl text-[#D8B068] lg:absolute lg:left-1/2 lg:top-7 lg:-translate-x-1/2">
                      {number}
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-2xl font-medium text-white lg:absolute lg:bottom-7 lg:left-1/2 lg:-translate-x-1/2 lg:rotate-180 lg:text-3xl lg:[writing-mode:vertical-rl]">
                      {value.title}
                    </span>
                  </div>

                  {/* Open content */}
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${
                      isActive
                        ? "translate-y-0 opacity-100 delay-200"
                        : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-7 sm:p-9">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#D8B068] bg-[#D8B068] text-[#0F1729]">
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <span className="font-['Cormorant_Garamond'] text-3xl font-medium text-white/80">
                        {number}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                      <h3 className="font-['Cormorant_Garamond'] text-4xl font-medium leading-none text-white sm:text-5xl">
                        {value.title}
                      </h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
                        {value.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const AboutCTA = () => (
  <section className="bg-white py-20 sm:py-24 lg:py-32">
    <Reveal className="mx-auto max-w-3xl px-6 text-center lg:px-10">
      <h2 className="font-['Cormorant_Garamond'] text-5xl font-medium leading-[1.02] tracking-tight text-[#0F1729] sm:text-6xl lg:text-7xl">
        Ready to plan your event?
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#4B5568] sm:text-lg">
        Choose your event, pick a package, and tell us what you need. We will
        take it from there.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/events"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F1729] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#D8B068] hover:text-[#0F1729]"
        >
          Explore events
          <ArrowRight size={18} strokeWidth={1.75} />
        </Link>
        {/* Scrolls to the contact details in the footer */}
        <button
          type="button"
          onClick={scrollToContact}
          className="inline-flex items-center justify-center rounded-lg border border-[#0F1729] px-8 py-4 text-sm font-semibold text-[#0F1729] transition-colors duration-300 hover:bg-[#0F1729] hover:text-white"
        >
          Contact us
        </button>
      </div>
    </Reveal>
  </section>
);

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */
const About = () => {
  return (
    <main className="bg-white font-['DM_Sans']">
      {/* Dark hero, so the navbar stays transparent until scrolled */}
      <CustomerNavbar transparentOnTop />
      <AboutHero />
      <Story />
      <HowWeWork />

      <AboutCTA />
    </main>
  );
};

export default About;