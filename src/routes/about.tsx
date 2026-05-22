import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Target,
  Heart,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamGrid } from "@/components/team-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Rizdeen Travels — Trusted Hajj & Umrah Agency" },
      {
        name: "description",
        content:
          "Serving Bangladeshi pilgrims with trust, care, and dedication since 2021. Learn about our mission, vision, and team.",
      },
      {
        property: "og:title",
        content: "About Rizdeen Travels — Trusted Hajj & Umrah Agency",
      },
      {
        property: "og:description",
        content:
          "Serving Bangladeshi pilgrims with trust, care, and dedication since 2021.",
      },
    ],
  }),
  component: AboutPage,
});


const STATS = [
  { value: "5+", label: "Customer Rating" },
  { value: "1500+", label: "Happy Pilgrims" },
  { value: "25+", label: "Packages" },
  { value: "5+", label: "Years of Service" },
];

function AboutPage() {
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
            <span className="text-white">About</span>
          </nav>
          <h1 className="text-4xl font-bold md:text-6xl">
            About Rizdeen Travels
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
            Serving Bangladeshi pilgrims with trust, care, and dedication since
            2021.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-[#0D0D0D] text-white">
        <div className="mx-auto max-w-4xl px-4 pb-20 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Our Story</h2>
          <div className="mx-auto my-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#E8651A]/40">
            <Target className="h-5 w-5 text-[#E8651A]" />
          </div>
          <p className="mx-auto max-w-[750px] text-base leading-relaxed text-white/80">
            For several years, Rizdeen Travels has been honoured to serve
            thousands of pilgrims from across Bangladesh on their sacred
            journeys to Makkah and Madinah. Founded with a simple mission — to
            make the rites of Hajj and Umrah accessible, comfortable, and
            spiritually focused — we have grown into one of the country's most
            trusted agencies, while keeping the heart of a small, family-run
            service.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#FFF8F2]">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-20 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "To enable every Bangladeshi Muslim to perform Hajj and Umrah with dignity, peace of mind, and uncompromising care — from the moment they enquire to the day they return home.",
            },
            {
              icon: Heart,
              title: "Our Vision",
              text: "To be the most trusted Hajj & Umrah partner in South Asia — recognised for spiritual sincerity, operational excellence, and pilgrim-first service.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5"
            >
              <Icon className="h-9 w-9 text-[#E8651A]" />
              <h3 className="mt-5 text-xl font-bold text-[#0D0D0D]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0D0D0D] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-white/15 px-4 py-14 md:grid-cols-4 md:divide-x md:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-4 text-center">
              <p className="text-4xl font-bold text-white md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Licensed */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0E6]">
            <ShieldCheck className="h-7 w-7 text-[#E8651A]" />
          </div>
          <h2 className="mt-5 text-3xl font-bold text-[#0D0D0D] md:text-4xl">
            Licensed & Certified
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Ministry of Hajj License No: 632
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90"
            >
              <Link to="/" hash="packages">
                Plan Your Journey <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8651A]">
              Our Team
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#0D0D0D] md:text-5xl">
              Meet Our Team
            </h2>
          </div>
          <TeamGrid />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8651A] px-4 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Begin Your Sacred Journey Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Contact us now and let us handle every detail of your pilgrimage.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90"
            >
              <Link to="/" hash="packages">
                View Packages
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-white hover:text-[#E8651A]"
            >
              <a
                href="https://wa.me/8801711366488"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
