import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";

// TODO: adjust these two imports to match your existing project structure.


import CustomerFooter from "../components/CustomerFooter";
import CustomerNavbar from "../components/CustomerNavbar";

/* ---------- Content (swap for real details) ---------- */
const HERO_IMAGE = "/images/contact-hero.jpg"; // dark, cinematic event photo
const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "hello@eventora.com", href: "mailto:hello@eventora.com" },
  { icon: Phone, label: "Phone", value: "+91 00000 00000", href: "tel:+910000000000" },
  { icon: MapPin, label: "Studio", value: "Eventora Studio, Your City, India" },
  { icon: Clock, label: "Hours", value: "Mon – Sat, 9:30 am to 6:30 pm" },
];
const EVENT_TYPES = ["Wedding", "Corporate event", "Birthday", "Engagement", "Other"];
const PACKAGES = [
  { id: "classic", name: "Classic", note: "Clean, elegant, refined" },
  { id: "royal", name: "Royal", note: "Grand, dark, gold-finished" },
];

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  pkg: "",
  message: "",
};

/* ---------- Single scroll reveal, respects reduced motion ---------- */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

/* ---------- Shared field styles ---------- */
const fieldBase =
  "w-full rounded-lg border bg-white px-4 py-3 text-[15px] text-[#111111] placeholder:text-[#555555]/60 " +
  "outline-none transition-colors duration-300 focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]";

function Field({ label, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[#111111]">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-[#111111]">
          <span className="mr-1 text-[#C6A15B]">•</span>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [formRef, formShown] = useReveal();

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!values.name.trim()) er.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) er.email = "Enter a valid email address.";
    if (values.phone && !/^[+\d][\d\s-]{7,}$/.test(values.phone))
      er.phone = "Enter a valid phone number.";
    if (!values.message.trim()) er.message = "Tell us a little about your event.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setStatus("sending");
    try {
      // TODO: replace with your existing API call, e.g. await api.post("/enquiries", values)
      await new Promise((r) => setTimeout(r, 900));
      setStatus("sent");
      setValues(INITIAL);
    } catch {
      setStatus("idle");
      setErrors({ form: "Your message didn't send. Check your connection and try again." });
    }
  };

  return (
    <div className="bg-white font-['Manrope'] text-[#555555]">
      <CustomerNavbar />

      {/* Hero */}
      <header className="relative flex min-h-[60vh] items-end overflow-hidden bg-[#111111] md:min-h-[68vh]">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-[#111111]/20" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 pt-40 md:px-10 md:pb-20">
          <h1 className="max-w-3xl font-['Playfair_Display'] text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl md:text-7xl">
            Let's plan an evening
            <br className="hidden sm:block" /> worth remembering.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Tell us about your event and a member of our team will reply within one working day.
          </p>
        </div>
      </header>

      {/* Details + form */}
      <main className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Details */}
          <aside className="lg:col-span-5">
            <h2 className="font-['Playfair_Display'] text-3xl font-medium leading-tight text-[#111111] md:text-4xl">
              Speak with our team
            </h2>
            <p className="mt-5 max-w-md leading-relaxed">
              Whether you have a date in mind or only an idea, we'll help you choose between our
              Classic and Royal packages and shape the details around you.
            </p>

            <ul className="mt-10 divide-y divide-[#E8E8E8] border-y border-[#E8E8E8]">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4 py-5">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-[#C6A15B]">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-sm text-[#555555]">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-semibold text-[#111111] transition-colors duration-300 hover:text-[#C6A15B]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-[#111111]">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Form */}
          <section
            ref={formRef}
            aria-labelledby="enquiry-heading"
            className={`rounded-lg border border-[#E8E8E8] bg-white p-6 shadow-[0_8px_30px_rgba(17,17,17,0.04)] transition-all duration-700 ease-out motion-reduce:transition-none sm:p-10 lg:col-span-7 ${
              formShown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
            }`}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-start py-10" role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#111111] text-[#C6A15B]">
                  <Check size={22} strokeWidth={1.5} />
                </span>
                <h2 className="mt-6 font-['Playfair_Display'] text-3xl font-medium text-[#111111]">
                  Message sent
                </h2>
                <p className="mt-3 max-w-md leading-relaxed">
                  Thank you. We'll reply within one working day to start planning your event.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 rounded-lg border border-[#111111] px-6 py-3 text-sm font-semibold text-[#111111] transition-colors duration-300 hover:border-[#C6A15B] hover:text-[#C6A15B]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2
                  id="enquiry-heading"
                  className="font-['Playfair_Display'] text-3xl font-medium text-[#111111]"
                >
                  Send an enquiry
                </h2>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Full name" htmlFor="name" error={errors.name}>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={set("name")}
                        placeholder="Your name"
                        className={`${fieldBase} ${errors.name ? "border-[#111111]" : "border-[#E8E8E8]"}`}
                      />
                    </Field>
                    <Field label="Email" htmlFor="email" error={errors.email}>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={set("email")}
                        placeholder="you@example.com"
                        className={`${fieldBase} ${errors.email ? "border-[#111111]" : "border-[#E8E8E8]"}`}
                      />
                    </Field>
                    <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={values.phone}
                        onChange={set("phone")}
                        placeholder="+91 00000 00000"
                        className={`${fieldBase} ${errors.phone ? "border-[#111111]" : "border-[#E8E8E8]"}`}
                      />
                    </Field>
                    <Field label="Event date (optional)" htmlFor="date">
                      <input
                        id="date"
                        type="date"
                        value={values.date}
                        onChange={set("date")}
                        className={`${fieldBase} border-[#E8E8E8]`}
                      />
                    </Field>
                  </div>

                  <Field label="Event type" htmlFor="eventType">
                    <select
                      id="eventType"
                      value={values.eventType}
                      onChange={set("eventType")}
                      className={`${fieldBase} border-[#E8E8E8]`}
                    >
                      <option value="">Select an event type</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Package: Classic (light) and Royal (dark + gold) */}
                  <fieldset>
                    <legend className="mb-2 block text-sm font-semibold text-[#111111]">
                      Package interest (optional)
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {PACKAGES.map((p) => {
                        const active = values.pkg === p.id;
                        const royal = p.id === "royal";
                        return (
                          <button
                            key={p.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setValues((v) => ({ ...v, pkg: active ? "" : p.id }))
                            }
                            className={`flex items-center justify-between rounded-lg border px-5 py-4 text-left transition-all duration-300 ${
                              royal
                                ? "bg-[#111111] text-white"
                                : "bg-white text-[#111111]"
                            } ${
                              active
                                ? "border-[#C6A15B] ring-1 ring-[#C6A15B]"
                                : royal
                                ? "border-[#111111] hover:border-[#C6A15B]"
                                : "border-[#E8E8E8] hover:border-[#C6A15B]"
                            }`}
                          >
                            <span>
                              <span className="block font-['Playfair_Display'] text-lg font-medium">
                                {p.name}
                              </span>
                              <span
                                className={`block text-sm ${royal ? "text-white/70" : "text-[#555555]"}`}
                              >
                                {p.note}
                              </span>
                            </span>
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300 ${
                                active
                                  ? "border-[#C6A15B] bg-[#C6A15B] text-[#111111]"
                                  : royal
                                  ? "border-white/30 text-transparent"
                                  : "border-[#E8E8E8] text-transparent"
                              }`}
                            >
                              <Check size={14} strokeWidth={2} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <Field label="Your message" htmlFor="message" error={errors.message}>
                    <textarea
                      id="message"
                      rows={5}
                      value={values.message}
                      onChange={set("message")}
                      placeholder="Guest count, venue, style, anything that matters to you"
                      className={`${fieldBase} resize-y ${errors.message ? "border-[#111111]" : "border-[#E8E8E8]"}`}
                    />
                  </Field>

                  {errors.form && (
                    <p role="alert" className="text-sm text-[#111111]">
                      <span className="mr-1 text-[#C6A15B]">•</span>
                      {errors.form}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#C6A15B] hover:text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {status === "sending" ? "Sending…" : "Send enquiry"}
                    <Send size={16} strokeWidth={1.5} />
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}