import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Brand icons                                                          */
/* Newer lucide-react versions removed brand logos (Instagram,          */
/* Facebook, YouTube), so they are drawn here as small outline SVGs     */
/* with the same size / strokeWidth props as Lucide icons.              */
/* ------------------------------------------------------------------ */
const makeIcon = (children) =>
  function BrandIcon({ size = 24, strokeWidth = 1.5, className = "" }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {children}
      </svg>
    );
  };

const Instagram = makeIcon(
  <>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </>
);

const Facebook = makeIcon(
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
);

const Youtube = makeIcon(
  <>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </>
);

/* ------------------------------------------------------------------ */
/* Content – edit here                                                  */
/* ------------------------------------------------------------------ */
const BRAND_TEXT =
  "Every special moment deserves to be remembered. Choose your event, pick a package, and let our team prepare a transparent, itemized quotation.";

// "Contact" page link removed: contact details now live in this footer.
const EXPLORE_LINKS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "About", to: "/about" },
];

const EVENT_LINKS = [
  { label: "Wedding", to: "/events?type=wedding" },
  { label: "Engagement", to: "/events?type=engagement" },
  { label: "Birthday", to: "/events?type=birthday" },
  { label: "Housewarming", to: "/events?type=housewarming" },
  { label: "Corporate Event", to: "/events?type=corporate" },
  { label: "Private Party", to: "/events?type=party" },
];

const PACKAGE_LINKS = [
  { label: "Classic", to: "/events?package=classic" },
  { label: "Royal", to: "/events?package=royal" },
];

// Replace with your real details. Anything left empty ("") is not shown.
const CONTACT = {
  email: "youremail@gmail.com",
  phone: "+91 00000 00000",
  whatsapp: "+91 00000 00000", // opens a WhatsApp chat
  address: "Your street, Your city, Kerala, India",
  hours: "Mon – Sat, 9:30 am to 6:30 pm",
};

// Add your real profile links. Empty ones are not shown.
const SOCIALS = [
  { label: "Instagram", href: "", icon: Instagram },
  { label: "Facebook", href: "", icon: Facebook },
  { label: "YouTube", href: "", icon: Youtube },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
const digits = (v) => v.replace(/[^\d+]/g, "");

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
      { threshold: 0.1 }
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

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-1 text-sm text-white/70 transition-colors duration-300 hover:text-[#D8B068]"
  >
    <span className="relative">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#D8B068] transition-all duration-300 group-hover:w-full" />
    </span>
  </Link>
);

const LinkColumn = ({ title, links }) => (
  <div>
    <h3 className="font-['Cormorant_Garamond'] text-2xl font-medium text-white">
      {title}
    </h3>
    <ul className="mt-5 space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <FooterLink to={link.to}>{link.label}</FooterLink>
        </li>
      ))}
    </ul>
  </div>
);

const ContactItem = ({ icon: Icon, href, external, children }) => {
  const inner = (
    <>
      <Icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#D8B068]" />
      <span className="break-words">{children}</span>
    </>
  );
  const base = "inline-flex items-start gap-3 text-sm text-white/70";
  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className={`${base} transition-colors duration-300 hover:text-[#D8B068]`}
        >
          {inner}
        </a>
      ) : (
        <span className={base}>{inner}</span>
      )}
    </li>
  );
};

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
const CustomerFooter = () => {
  const socials = SOCIALS.filter((s) => s.href);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#0F1729] font-['DM_Sans']">
      <div className="mx-auto max-w-7xl px-6 pt-20 lg:px-10 lg:pt-28">
        {/* Top: brand + link columns */}
        <Reveal className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-12 lg:gap-x-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <Link
              to="/"
              className="font-['Cormorant_Garamond'] text-4xl font-semibold tracking-tight text-white"
            >
              Eventora<span className="text-[#D8B068]">.</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              {BRAND_TEXT}
            </p>
            <Link
              to="/events"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#D8B068] px-7 py-3.5 text-sm font-semibold text-[#0F1729] transition-colors duration-300 hover:bg-white"
            >
              Plan your event
              <ArrowRight size={18} strokeWidth={1.75} />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Explore" links={EXPLORE_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Events" links={EVENT_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Packages" links={PACKAGE_LINKS} />
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <h3 className="font-['Cormorant_Garamond'] text-2xl font-medium text-white">
              Contact
            </h3>

            <ul className="mt-5 space-y-3">
              {CONTACT.email && (
                <ContactItem icon={Mail} href={`mailto:${CONTACT.email}`}>
                  <span className="break-all">{CONTACT.email}</span>
                </ContactItem>
              )}
              {CONTACT.phone && (
                <ContactItem icon={Phone} href={`tel:${digits(CONTACT.phone)}`}>
                  {CONTACT.phone}
                </ContactItem>
              )}
              {CONTACT.whatsapp && (
                <ContactItem
                  icon={MessageCircle}
                  href={`https://wa.me/${digits(CONTACT.whatsapp).replace("+", "")}`}
                  external
                >
                  Chat on WhatsApp
                </ContactItem>
              )}
              {CONTACT.address && <ContactItem icon={MapPin}>{CONTACT.address}</ContactItem>}
              {CONTACT.hours && <ContactItem icon={Clock}>{CONTACT.hours}</ContactItem>}
            </ul>

            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-colors duration-300 hover:border-[#D8B068] hover:bg-[#D8B068] hover:text-[#0F1729]"
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/15 py-8 sm:flex-row sm:items-center">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Eventora. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-3 text-sm font-semibold text-white transition-colors duration-300 hover:text-[#D8B068] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B068]"
          >
            Back to top
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#D8B068] group-hover:bg-[#D8B068] group-hover:text-[#0F1729]">
              <ArrowUp size={18} strokeWidth={1.5} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;