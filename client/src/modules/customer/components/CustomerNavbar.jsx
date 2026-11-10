import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { getMe } from "../../../services/authService"; // adjust if your path differs

/* ------------------------------------------------------------------ */
/* Eventora customer theme (unchanged)                                  */
/*   Emerald ink  #0E3B2E  – text, primary buttons                      */
/*   Ivory        #FAF7F0  – page / navbar background                   */
/*   Gold         #C8963E  – accents, underline, hover                  */
/*   Body         #3E4A44  – secondary text                             */
/*   Line         #E6DFD0  – borders                                    */
/*   Sand         #F1E9DA  – soft hover background                      */
/* Fonts: Fraunces (headings) + Plus Jakarta Sans (body)                */
/* ------------------------------------------------------------------ */

const TOKEN_KEY = "eventora_token"; // same key used in api.js
const AUTH_EVENT = "auth-change";

// "Contact" has no page: it scrolls to the footer (id="contact").
const GUEST_LINKS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "About", to: "/about" },
  { label: "Contact", anchor: "contact" },
];

const CUSTOMER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "My Bookings", to: "/my-bookings" },
  { label: "About", to: "/about" },
  { label: "Contact", anchor: "contact" },
];

const scrollToAnchor = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/**
 * CustomerNavbar
 * - transparentOnTop (bool, default: true on "/" only): transparent over the hero until scrolled
 * - unreadCount (number): shows a gold dot on the bell when > 0
 * - onNotificationClick (fn): optional handler for the bell icon
 */
const CustomerNavbar = ({
  transparentOnTop,
  unreadCount = 0,
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(
    () => !!localStorage.getItem(TOKEN_KEY)
  );
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isCustomer = user?.role === "customer";
  const links = isCustomer ? CUSTOMER_LINKS : GUEST_LINKS;

  const overHero = transparentOnTop ?? pathname === "/";
  const isSolid = !overHero || scrolled || mobileOpen;

  /* ---------------------------- Auth check --------------------------- */
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data?.success ? data.user : null);
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
      }
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  useEffect(() => {
    const refresh = () => loadUser();
    window.addEventListener(AUTH_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [loadUser]);

  /* ------------------------------ Scroll ----------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- Close menus on route change / outside ------------- */
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  /* ------------------------------ Actions ---------------------------- */
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
    window.dispatchEvent(new Event(AUTH_EVENT));
    navigate("/", { replace: true });
  };

  const handleAnchor = (id) => {
    setMobileOpen(false);
    // Wait a tick so the mobile menu closes and scroll-lock is released first
    setTimeout(() => scrollToAnchor(id), 50);
  };

  /* ------------------------------ Styles ----------------------------- */
  const iconBtn =
    "relative flex h-10 w-10 items-center justify-center rounded-lg text-[#0E3B2E] transition-colors duration-300 hover:bg-[#F1E9DA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E]";

  // Larger, more readable desktop links with a clear underline cue
  const desktopBase =
    "relative py-1.5 text-[15px] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#C8963E] after:transition-all after:duration-300 focus:outline-none focus-visible:text-[#C8963E]";
  const desktopLinkClass = ({ isActive }) =>
    `${desktopBase} ${
      isActive
        ? "text-[#0E3B2E] after:w-full"
        : "text-[#0E3B2E]/80 after:w-0 hover:text-[#0E3B2E] hover:after:w-full"
    }`;
  const desktopAnchorClass = `${desktopBase} text-[#0E3B2E]/80 after:w-0 hover:text-[#0E3B2E] hover:after:w-full`;

  const mobileBase =
    "block w-full border-b border-[#E6DFD0] py-4 text-left font-['Fraunces'] text-xl transition-colors duration-300";
  const mobileLinkClass = ({ isActive }) =>
    `${mobileBase} ${
      isActive ? "text-[#C8963E]" : "text-[#0E3B2E] hover:text-[#C8963E]"
    }`;

  const initial = (user?.fullName || user?.email || "U").charAt(0).toUpperCase();

  /* ------------------------------ Render ----------------------------- */
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
        isSolid
          ? "border-b border-[#E6DFD0] bg-[#FAF7F0]/95 shadow-[0_1px_0_rgba(14,59,46,0.02)] backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-20 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        {/* LEFT: brand */}
        <Link
          to="/"
          className="justify-self-start font-['Fraunces'] text-2xl font-semibold leading-none tracking-tight text-[#0E3B2E] lg:text-[30px]"
        >
          Eventora<span className="text-[#C8963E]">.</span>
        </Link>

        {/* CENTER: links (desktop) */}
        <ul className="hidden items-center gap-9 lg:flex xl:gap-10">
          {links.map((link) => (
            <li key={link.label}>
              {link.anchor ? (
                <button
                  type="button"
                  onClick={() => handleAnchor(link.anchor)}
                  className={desktopAnchorClass}
                >
                  {link.label}
                </button>
              ) : (
                <NavLink to={link.to} end={link.to === "/"} className={desktopLinkClass}>
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT: auth area */}
        <div className="flex items-center gap-2 justify-self-end sm:gap-3">
          {authLoading ? null : isCustomer ? (
            <>
              <button
                type="button"
                aria-label="Notifications"
                onClick={onNotificationClick}
                className={iconBtn}
              >
                <Bell size={20} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#C8963E] ring-2 ring-[#FAF7F0]" />
                )}
              </button>

              {/* Profile + dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8963E]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0E3B2E] text-sm font-semibold text-[#FAF7F0] transition-colors duration-300 hover:bg-[#C8963E] hover:text-[#0E3B2E]">
                    {initial}
                  </span>
                </button>

                <div
                  role="menu"
                  className={`absolute right-0 top-full mt-3 w-64 origin-top-right rounded-lg border border-[#E6DFD0] bg-white shadow-[0_12px_32px_rgba(14,59,46,0.10)] transition-all duration-200 ${
                    profileOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="border-b border-[#E6DFD0] px-5 py-4">
                    <p className="truncate font-['Fraunces'] text-lg font-semibold text-[#0E3B2E]">
                      {user?.fullName}
                    </p>
                    <p className="mt-1 truncate text-sm text-[#3E4A44]">{user?.email}</p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-b-lg px-5 py-3.5 text-sm font-medium text-[#0E3B2E] transition-colors duration-300 hover:bg-[#F1E9DA]"
                  >
                    <LogOut size={18} strokeWidth={1.5} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                className="rounded-lg border border-[#0E3B2E] px-5 py-2.5 text-sm font-semibold text-[#0E3B2E] transition-colors duration-300 hover:bg-[#0E3B2E] hover:text-[#FAF7F0]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-[#0E3B2E] px-5 py-2.5 text-sm font-semibold text-[#FAF7F0] transition-colors duration-300 hover:bg-[#C8963E] hover:text-[#0E3B2E]"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={`${iconBtn} lg:hidden`}
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu: full-height panel, large readable links */}
      <div
        className={`overflow-y-auto bg-[#FAF7F0] transition-[max-height] duration-300 ease-out lg:hidden ${
          mobileOpen ? "max-h-[calc(100dvh-4rem)]" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-10 pt-2 sm:px-8">
          {links.map((link) =>
            link.anchor ? (
              <button
                key={link.label}
                type="button"
                onClick={() => handleAnchor(link.anchor)}
                className={`${mobileBase} text-[#0E3B2E] hover:text-[#C8963E]`}
              >
                {link.label}
              </button>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={mobileLinkClass}
              >
                {link.label}
              </NavLink>
            )
          )}

          {!authLoading && !isCustomer && (
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="rounded-lg border border-[#0E3B2E] px-5 py-3 text-center text-sm font-semibold text-[#0E3B2E] transition-colors duration-300 hover:bg-[#0E3B2E] hover:text-[#FAF7F0]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-[#0E3B2E] px-5 py-3 text-center text-sm font-semibold text-[#FAF7F0] transition-colors duration-300 hover:bg-[#C8963E] hover:text-[#0E3B2E]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;