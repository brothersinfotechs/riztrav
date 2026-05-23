import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/testimonial-card";
import { TeamGrid } from "@/components/team-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { Reveal } from "@/components/reveal";
import { TESTIMONIALS } from "@/data/testimonials";
import { usePackages, useTestimonials } from "@/hooks/use-content";
import kaabaImage from "@/assets/kaaba.jpg";
import heroMedina from "@/assets/hero-medina.jpeg";
import heroKaaba from "@/assets/hero-kaaba.jpg";
import {
  MoonStar,
  Plane,
  ShieldCheck,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Bus,
  BadgeDollarSign,
  GraduationCap,
  Headphones,
  Award,
  ArrowRight,
  PlayCircle,
  CalendarDays,
  Briefcase,
  Ticket,
  FileCheck,
  Car,

} from "lucide-react";

function useCountdown(target: Date) {
  const [mounted, setMounted] = React.useState(false);
  const [now, setNow] = React.useState(() => target.getTime());
  React.useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs, mounted };
}

const COUNTDOWN_TARGET = new Date("2026-08-19T00:00:00");

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[84px] rounded-xl border border-white/15 bg-black/40 px-5 py-3 text-center backdrop-blur-md">
      <p className="text-3xl font-bold leading-none text-white tabular-nums md:text-4xl">
        {value.toString().padStart(2, "0")}
      </p>
      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
        {label}
      </p>
    </div>
  );
}


const HERO_SLIDES = [heroKaaba, heroMedina];

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

function CounterItem({
  value,
  suffix = "",
  label,
  start,
}: {
  value: number;
  suffix?: string;
  label: string;
  start: boolean;
}) {
  const n = useCountUp(value, 1800, start);
  return (
    <div className="flex flex-col items-center px-6 py-4 text-center text-white">
      <span className="text-3xl font-bold tracking-tight md:text-4xl">
        {n.toLocaleString()}
        {suffix}
      </span>
      <span className="mt-1 text-xs uppercase tracking-widest text-white/75 md:text-sm">
        {label}
      </span>
    </div>
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rizdeen Travels — Trusted Hajj & Umrah Packages from Bangladesh" },
      {
        name: "description",
        content:
          "Rizdeen Travels offers government-approved Hajj and Umrah packages with guided group tours, visa support, and 5-star accommodations near Haram.",
      },
      { property: "og:title", content: "Rizdeen Travels — Hajj & Umrah Specialists" },
      {
        property: "og:description",
        content:
          "Sacred journeys made simple. Trusted by 1,500+ pilgrims since 2021.",
      },
    ],
  }),
  component: HomePage,
});

function TestimonialsList() {
  const { data: dbItems = [] } = useTestimonials();
  const items = (dbItems as any[]).length > 0 ? (dbItems as any[]).slice(0, 6) : TESTIMONIALS.slice(0, 6);
  return (
    <>
      {items.map((t: any, i: number) => (
        <Reveal key={t.id} variant="up" delay={i * 100}>
          <TestimonialCard t={t} />
        </Reveal>
      ))}
    </>
  );
}

type PackageType = "HAJJ" | "UMRAH";

const FALLBACK_FEATURED = [
  {
    slug: "premium-umrah",
    name: "Premium Umrah",
    type: "UMRAH",
    price: "৳2,25,000",
    duration: "14 Days",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800",
    highlights: ["5-star hotel near Haram", "Private transport", "Guided ziyarat"],
    is_featured: true,
  },
  {
    slug: "hajj-standard",
    name: "Hajj Standard",
    type: "HAJJ",
    price: "৳7,20,000",
    duration: "40 Days",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800",
    highlights: ["Govt. approved", "4-star hotel", "Certified muallim"],
    is_featured: true,
  },
  {
    slug: "economy-umrah",
    name: "Economy Umrah",
    type: "UMRAH",
    price: "৳1,45,000",
    duration: "10 Days",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
    highlights: ["Budget-friendly", "Group travel", "All essentials included"],
    is_featured: true,
  },
];

function PackagesSection() {
  const { data: packages = [] } = usePackages();
  const featured = (packages as any[]).filter((p) => p.is_featured && p.is_active !== false).slice(0, 3);
  const visible = featured.length >= 3 ? featured : FALLBACK_FEATURED;

  return (
    <section id="packages" className="bg-[#FFF8F2] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <Reveal variant="up" className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8651A]">
              Our Packages
            </p>
            <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight text-[#0D0D0D] md:text-5xl">
              Featured Packages
            </h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Hand-picked packages for every pilgrim's need and budget
            </p>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8651A] hover:underline"
          >
            See All <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* Cards */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p: any, idx: number) => (
            <Reveal
              key={p.slug}
              variant="scale"
              delay={idx * 150}
              as="article"
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Link
                to="/packages/$slug"
                params={{ slug: p.slug }}
                className="absolute inset-0 z-0"
                aria-label={p.name}
              />
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-md bg-[#E8651A] px-3 py-1 text-xs font-bold tracking-widest text-white shadow">
                  {p.type}
                </span>
                {p.is_featured && (
                  <div className="pointer-events-none absolute -right-12 top-6 w-44 rotate-45 bg-[#E8651A] py-1.5 text-center text-xs font-bold tracking-wider text-white shadow-lg">
                    MOST POPULAR
                  </div>
                )}
              </div>

              <div className="relative z-10 flex flex-col gap-4 p-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0D0D0D]">{p.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {p.duration}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#E8651A]">{p.price}</span>
                  <span className="text-sm text-muted-foreground">/person</span>
                </div>

                <ul className="space-y-2">
                  {(p.highlights ?? []).map((h: string) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0D0D0D]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative z-10 mt-2 flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white"
                  >
                    <Link to="/packages/$slug" params={{ slug: p.slug }}>View Details</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-[#E8651A] text-white hover:bg-[#E8651A]/90">
                    <Link to="/packages/$slug" params={{ slug: p.slug }} hash="enquiry">
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#E8651A] px-10 py-6 text-base font-semibold text-white shadow-lg hover:bg-[#E8651A]/90"
          >
            <Link to="/packages">
              View All Packages <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Explore all 7 Hajj &amp; Umrah packages
          </p>
        </div>
      </div>
    </section>
  );
}



const whyFeatures = [
  { icon: ShieldCheck, title: "Ministry of Hajj Licensed", desc: "Government-approved with full compliance and documentation." },
  { icon: BadgeDollarSign, title: "Guaranteed Best Prices", desc: "Transparent pricing with no hidden fees — we'll match or refund." },
  { icon: Building2, title: "4 & 5 Star Hotel Options", desc: "Hand-picked accommodations close to the Haram and Masjid Nabawi." },
  { icon: GraduationCap, title: "Certified Mutawwif Guides", desc: "Bangla-speaking scholars walk you through every ritual with care." },
  { icon: Bus, title: "Full Transport Included", desc: "Door-to-door logistics across Saudi Arabia — no hidden charges." },
  { icon: Headphones, title: "24/7 Dedicated Support", desc: "Always-available helpline before, during, and after your travel." },
];

function HeroSection({ days, hours, mins, secs }: { days: number; hours: number; mins: number; secs: number }) {
  const [slide, setSlide] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 70px)" }}>
      {HERO_SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === slide ? 1 : 0 }}
        >
          <img
            src={src}
            alt={i === 0 ? "Masjid al-Haram, Makkah" : "Masjid an-Nabawi, Madinah"}
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.60)" }} />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 pt-20 pb-24 text-center text-white">
        <div
          className="hero-anim hero-fade-down inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-5 py-2 text-xs text-white backdrop-blur-md md:text-sm"
          style={{ animationDelay: "200ms" }}
        >
          <Plane className="h-4 w-4" />
          <span>Hajj License No: 0632</span>
        </div>

        <p
          dir="rtl"
          lang="ar"
          className="hero-anim hero-fade mt-5 font-serif text-2xl text-[#F5D78E] md:text-4xl"
          style={{ animationDelay: "400ms", textShadow: "0 2px 20px rgba(0,0,0,15)" }}
        >
          لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
        </p>

        <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span className="hero-anim hero-slide-left block" style={{ animationDelay: "600ms" }}>
            Begin Your Sacred Journey
          </span>
          <span className="hero-anim hero-slide-right block" style={{ animationDelay: "800ms" }}>
            with <span className="text-[#E8651A]">Peace of Mind</span>
          </span>
        </h1>

        <p
          className="hero-anim hero-fade-up mt-4 max-w-[600px] text-sm leading-relaxed text-white/90 md:text-base"
          style={{ animationDelay: "1000ms" }}
        >
          Experience a seamless and spiritually enriching pilgrimage with expert
          guidance, premium accommodations, and fully transparent arrangements.
        </p>

        <div
          className="hero-anim hero-fade-up mt-6 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "1200ms" }}
        >
          <Button asChild size="lg" className="rounded-full bg-[#E8651A] px-7 text-white shadow-lg hover:bg-[#E8651A]/90">
            <Link to="/packages">View Packages <ArrowRight /></Link>
          </Button>
          <Button asChild size="lg" className="rounded-full border border-white/15 bg-black/40 px-7 text-white backdrop-blur-md hover:bg-black/60">
            <a href="#about"><PlayCircle /> Watch Our Story</a>
          </Button>
        </div>

        <div
          className="hero-anim hero-fade-up mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-white md:text-sm"
          style={{ animationDelay: "1400ms" }}
        >
          {["1500+ Happy Pilgrims", "5+ Years Experience", "Ministry Licensed"].map((s, i) => (
            <React.Fragment key={s}>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#E8651A]" />
                {s}
              </span>
              {i < 2 && <span className="text-white/30">|</span>}
            </React.Fragment>
          ))}
        </div>

        <div
          className="hero-anim hero-fade-up mt-8 flex flex-col items-center"
          style={{ animationDelay: "1600ms" }}
        >
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8651A] md:text-xs">
            <CalendarDays className="h-4 w-4" /> Countdown to Next Umrah
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <CountdownBox value={days} label="Days" />
            <CountdownBox value={hours} label="Hours" />
            <CountdownBox value={mins} label="Mins" />
            <CountdownBox value={secs} label="Secs" />
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === slide ? "bg-[#E8651A] w-6" : "bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [start, setStart] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: 1500, suffix: "+", label: "Happy Pilgrims" },
    { value: 5, suffix: "+", label: "Years of Service" },
    { value: 25, suffix: "+", label: "Packages Offered" },
    { value: 5, suffix: "★", label: "Customer Rating" },
  ];

  return (
    <section ref={ref} className="bg-[#E8651A] py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 md:grid-cols-4 md:divide-x md:divide-white/30 md:gap-0">
        {stats.map((s, i) => (
          <StatItem key={s.label} {...s} start={start} index={i} />
        ))}
      </div>
    </section>
  );
}

function StatItem({ value, suffix, label, decimal, start, index = 0 }: { value: number; suffix: string; label: string; decimal?: boolean; start: boolean; index?: number }) {
  const n = useCountUp(decimal ? value * 10 : value, 1800, start);
  const display = decimal ? (n / 10).toFixed(1) : n.toLocaleString();
  return (
    <div
      className={`reveal reveal-up ${start ? "is-visible" : ""} px-6 text-center`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <p className="text-4xl font-bold text-white md:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
        {label}
      </p>
    </div>
  );
}


function HomePage() {
  const [scrolled, setScrolled] = React.useState(false);
  const { days, hours, mins, secs } = useCountdown(COUNTDOWN_TARGET);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <SiteNavbar />


      {/* Hero */}
      <HeroSection days={days} hours={hours} mins={mins} secs={secs} />

      {/* Stats */}
      <StatsSection />




      {/* Packages */}
      <PackagesSection />

      {/* Why Choose Us */}
      <section id="why" className="bg-[#FFF8F2]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <Reveal variant="left" className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-xl">
              <img
                src={kaabaImage}
                alt="Masjid al-Haram with Kaaba"
                loading="lazy"
                className="h-[560px] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-6 right-6 flex items-center gap-3 rounded-xl bg-[#E8651A] px-5 py-4 text-white shadow-xl">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight">5+ Years</p>
                <p className="text-xs text-white/85">Of trusted service</p>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal variant="right">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8651A]">
              Why Choose Us
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-[#0D0D0D] md:text-5xl">
              The Rizdeen Travels Difference
            </h2>
            <p className="mt-5 max-w-xl text-[#0D0D0D]/70">
              From your first call to your safe return, we obsess over every detail so
              you can focus on worship.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {whyFeatures.map((f, idx) => (
                <Reveal key={f.title} variant="up" delay={idx * 100} className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8651A]/10 text-[#E8651A]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D0D0D]">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#0D0D0D]/65">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90"
              >
                <a href="#contact">
                  Get Free Consultation <ArrowRight />
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8651A]">
              What We Offer
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#0D0D0D] md:text-5xl">
              Our Services
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-base text-neutral-500">
              Reliable and well-organized Hajj & Umrah services designed to make your journey smooth, stress-free, and spiritually fulfilling.
            </p>
          </Reveal>

          {(() => {
            const services = [
              { title: "Hajj Solutions", desc: "Hajj packages (B2B & B2C), group Hajj, and customized plans managed end-to-end.", icon: Briefcase, bg: "#FFF0E6", iconBg: "#FBD9C2", iconColor: "#0D0D0D", active: false },
              { title: "Umrah Solutions", desc: "Group and customized Umrah packages tailored to your time and budget.", icon: MoonStar, bg: "#E8F5F0", iconBg: "#CDE9DD", iconColor: "#0D0D0D", active: true },
              { title: "Air Ticketing", desc: "Worldwide flight booking at competitive prices — fast and reliable.", icon: Ticket, bg: "#EEF4FF", iconBg: "#D6E2FB", iconColor: "#0D0D0D", active: false },
              { title: "Visa Processing", desc: "Fast, hassle-free Umrah visa processing handled by our specialists.", icon: FileCheck, bg: "#FFF0E6", iconBg: "#FBD9C2", iconColor: "#0D0D0D", active: false },
              { title: "Transport Services", desc: "Private transport across Saudi Arabia — airport, Ziyarah, Makkah & Madinah.", icon: Car, bg: "#F3EEFF", iconBg: "#DDD0FB", iconColor: "#0D0D0D", active: false },
            ];
            const Card = ({ s }: { s: typeof services[number]; i: number }) => {
              const Icon = s.icon;
              return (
                <div
                  className="rounded-2xl p-8 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: s.bg }}
                >
                  <div
                    className="mb-12 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{ backgroundColor: s.iconBg }}
                  >
                    <Icon className="h-6 w-6" style={{ color: s.iconColor }} />
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: s.active ? "#E8651A" : "#0D0D0D" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{s.desc}</p>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#E8651A] hover:gap-2 transition-all"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              );
            };

            return (
              <div className="mt-14 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {services.slice(0, 3).map((s, i) => <Card key={s.title} s={s} i={i} />)}
                </div>
                <div className="grid gap-6 md:grid-cols-2 md:mx-auto md:max-w-[66%]">
                  {services.slice(3).map((s, i) => <Card key={s.title} s={s} i={i + 3} />)}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8651A]">
              Our Team
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#0D0D0D] md:text-5xl">
              Meet the People Behind Your Journey
            </h2>
            <p className="mx-auto mt-4 max-w-[650px] text-base text-neutral-500">
              A dedicated team of professionals committed to making your sacred journey smooth and memorable.
            </p>
          </Reveal>

          <TeamGrid />
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8651A]">
              Pilgrim Stories
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#0D0D0D] md:text-5xl">
              What Our Pilgrims Say
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialsList />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl px-4 py-20">

          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8651A]">
              Simple Process
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#0D0D0D] md:text-5xl">
              Book Your Package in 4 Easy Steps
            </h2>
          </Reveal>

          {(() => {
            const steps = [
              { n: 1, title: "Choose Package", desc: "Browse our Hajj & Umrah packages." },
              { n: 2, title: "Submit Enquiry", desc: "Fill our simple enquiry form." },
              { n: 3, title: "Confirm & Pay", desc: "Review itinerary and make payment." },
              { n: 4, title: "Travel in Peace", desc: "We handle everything from here." },
            ];
            return (
              <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-0">
                {steps.map((s, i) => (
                  <div key={s.n} className="relative flex flex-col items-center text-center">
                    {i < steps.length - 1 && (
                      <Reveal
                        variant="fade"
                        delay={i * 200 + 200}
                        as="div"
                        className="connector-line absolute left-1/2 top-[30px] hidden h-0 border-t-2 border-dashed border-[#E8651A] md:block"
                        aria-hidden
                      />
                    )}
                    <Reveal
                      variant="pop"
                      delay={i * 200}
                      className="relative z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#E8651A] text-xl font-bold text-white shadow-[0_0_0_8px_#FFF8F2]"
                    >
                      {s.n}
                    </Reveal>
                    <Reveal as="h3" variant="up" delay={i * 200 + 100} className="mt-6 text-lg font-bold text-[#0D0D0D]">
                      {s.title}
                    </Reveal>
                    <Reveal as="p" variant="up" delay={i * 200 + 150} className="mt-2 max-w-[200px] text-sm text-[#666666]">
                      {s.desc}
                    </Reveal>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>


      {/* About / Stats */}
      <section id="about" className="bg-[#0D0D0D] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-block rounded bg-[#E8651A] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              About Us
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Walk the path of the Prophet ﷺ with confidence
            </h2>
            <div className="mt-3 h-1 w-16 bg-[#E8651A]" />
            <p className="mt-5 max-w-xl text-white/80">
              For over 5 years, Rizdeen Travels has been guiding Bangladeshi pilgrims
              through their most important journey. From visa to ziyarah, we handle every
              detail so you can focus on worship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[#E8651A] text-white hover:bg-[#E8651A]/90">
                <a href="#contact">Talk to an Advisor</a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "5+", l: "Years experience" },
              { n: "5,000+", l: "Pilgrims served" },
              { n: "98%", l: "Repeat referrals" },
              { n: "24/7", l: "On-ground support" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
              >
                <p className="text-3xl font-bold text-[#E8651A]">{s.n}</p>
                <p className="text-white/75">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="contact" className="bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-8 rounded-3xl border bg-white p-8 shadow-sm md:grid-cols-3 md:p-12">
          <div className="md:col-span-2">
            <span className="inline-block rounded bg-[#E8651A] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              Contact
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#0D0D0D]">Ready to begin your journey?</h2>
            <div className="mt-3 h-1 w-16 bg-[#E8651A]" />
            <p className="mt-3 text-muted-foreground">
              Call or message us — our advisors reply within minutes.
            </p>
          </div>
          <div className="space-y-4">
            <a
              href="tel:+8801711366488"
              className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
            >
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Call us</p>
                <p className="font-semibold">+880 1711-366488</p>
              </div>
            </a>
            <a
              href="https://wa.me/8801711366488"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="font-semibold">Chat with us</p>
              </div>
            </a>
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Office</p>
                <p className="font-semibold">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>


      <Reveal variant="up"><SiteFooter /></Reveal>


      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/8801711366488"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
