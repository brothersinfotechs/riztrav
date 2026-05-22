import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  MoonStar,
  Ticket,
  FileCheck,
  Car,
  ChevronRight,
  Plane,
  Globe2,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Rizdeen Travels" },
      {
        name: "description",
        content:
          "Comprehensive Hajj & Umrah solutions — packages, group travel, air ticketing, visa processing, and transport across Saudi Arabia.",
      },
      { property: "og:title", content: "Our Services — Rizdeen Travels" },
      {
        property: "og:description",
        content:
          "Comprehensive Hajj & Umrah solutions tailored for every pilgrim.",
      },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  num: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  subs: { title: string; desc: string }[];
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Hajj Solutions",
    desc: "Complete Hajj services with care, planning, and trusted guidance.",
    icon: Briefcase,
    subs: [
      {
        title: "Hajj Packages (B2B & B2C)",
        desc: "Complete Hajj services for individual clients as well as partner agencies, managed with care and attention to detail.",
      },
      {
        title: "Group Hajj",
        desc: "Well-organized group arrangements with experienced guides and full support throughout the journey.",
      },
      {
        title: "Customized Hajj",
        desc: "Private Hajj plans tailored to your needs, schedule, and budget.",
      },
    ],
  },
  {
    num: "02",
    title: "Umrah Solutions",
    desc: "Smooth, comfortable Umrah experiences for groups and individuals.",
    icon: MoonStar,
    subs: [
      {
        title: "Group Umrah",
        desc: "Perfectly managed group Umrah packages for a smooth and comfortable experience.",
      },
      {
        title: "Customized Umrah",
        desc: "Umrah packages designed according to your preferred time, budget, and requirements.",
      },
    ],
  },
  {
    num: "03",
    title: "Air Ticketing",
    desc: "Easy and reliable global flight booking at competitive prices.",
    icon: Ticket,
    subs: [
      {
        title: "Worldwide Air Tickets",
        desc: "Easy and reliable flight booking services to any destination at competitive prices.",
      },
    ],
  },
  {
    num: "04",
    title: "Visa Processing",
    desc: "Fast, hassle-free visa support handled by experienced specialists.",
    icon: FileCheck,
    subs: [
      {
        title: "Umrah Visa Service",
        desc: "Fast and hassle-free Umrah visa processing, support from start to finish.",
      },
    ],
  },
  {
    num: "05",
    title: "Transport Services",
    desc: "Comfortable private transport across the holy cities.",
    icon: Car,
    subs: [
      {
        title: "Transport in Saudi Arabia",
        desc: "Reliable route transport covering airport pickup/dropoff, Ziyarah trips, and travel between Makkah and Madinah.",
      },
    ],
  },
];

const TABS = [
  { label: "B2B & B2C", icon: Briefcase },
  { label: "Customizable", icon: Settings2 },
  { label: "Worldwide Tickets", icon: Globe2 },
  { label: "Saudi Transport", icon: Car },
];

function ServicesPage() {
  return (
    <div className="bg-white">
      <SiteNavbar />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D0D0D] text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #E8651A 1px, transparent 1px), radial-gradient(circle at 80% 70%, #E8651A 1px, transparent 1px)",
            backgroundSize: "40px 40px, 60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center">
          <nav
            className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-[#E8651A]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Services</span>
          </nav>
          <h1 className="text-4xl font-bold md:text-6xl">Our Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
            Comprehensive Hajj & Umrah solutions tailored for every pilgrim.
          </p>
        </div>
      </section>

      {/* Service rows */}
      <section className="bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-20">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.num}
                className="group relative overflow-hidden rounded-2xl border border-[#F5E6D8] bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8"
              >
                <span className="absolute left-0 top-0 h-full w-0 bg-[#E8651A] transition-all duration-300 group-hover:w-1" />
                <div className="relative grid items-start gap-8 md:grid-cols-12">
                  {/* Left */}
                  <div className="md:col-span-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E8651A] text-white shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8651A]">
                          Service {s.num}
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-[#0D0D0D]">
                          {s.title}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-neutral-600">{s.desc}</p>
                  </div>

                  {/* Middle */}
                  <div className="grid gap-4 md:col-span-7 md:grid-cols-2">
                    {s.subs.map((sub) => (
                      <div
                        key={sub.title}
                        className="rounded-xl border border-[#F5E6D8] bg-[#FFF8F2] p-4"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E8651A]" />
                          <div>
                            <h3 className="text-sm font-bold text-[#0D0D0D]">
                              {sub.title}
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                              {sub.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right: large number */}
                  <div className="hidden md:col-span-1 md:flex md:items-start md:justify-end">
                    <span className="text-6xl font-black leading-none text-neutral-200 md:text-7xl">
                      {s.num}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-3 pt-8 md:grid-cols-4">
            {TABS.map((t, i) => {
              const Icon = t.icon;
              const active = i === 0;
              return (
                <button
                  key={t.label}
                  className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "border-[#E8651A] bg-[#E8651A] text-white shadow-sm"
                      : "border-[#F5E6D8] bg-white text-[#0D0D0D] hover:border-[#E8651A] hover:text-[#E8651A]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-20">
        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl p-10 text-center text-white shadow-xl md:p-16"
          style={{
            background:
              "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #0D0D0D 100%)",
          }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Plane className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold md:text-4xl">
            Ready to plan your journey?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Talk to our advisors and we'll tailor the right Hajj, Umrah,
            ticketing or visa solution for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#E8651A] text-white hover:bg-[#E8651A]/90"
            >
              <a href="/#contact">Contact Us</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-[#0D0D0D]"
            >
              <Link to="/" hash="packages">
                View Packages
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
