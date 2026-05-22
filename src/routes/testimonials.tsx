import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/testimonial-card";
import { TESTIMONIALS } from "@/data/testimonials";
import { useTestimonials } from "@/hooks/use-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Pilgrim Stories — Rizdeen Travels" },
      {
        name: "description",
        content:
          "Real experiences from Hajj and Umrah pilgrims who traveled with Rizdeen Travels.",
      },
      { property: "og:title", content: "Pilgrim Stories — Rizdeen Travels" },
      {
        property: "og:description",
        content: "Real experiences from our blessed travelers.",
      },
    ],
  }),
  component: TestimonialsPage,
});

const FILTERS = ["All", "Hajj", "Umrah", "Recent"] as const;
type Filter = (typeof FILTERS)[number];

const STATS = [
  { value: "1500+", label: "Happy Pilgrims" },
  { value: "5★", label: "Average Rating" },
  { value: "5+", label: "Years Serving" },
  { value: "98%", label: "Recommend Us" },
];

function TestimonialsPage() {
  const [filter, setFilter] = React.useState<Filter>("All");
  const { data: dbItems = [] } = useTestimonials();

  const source: any[] = (dbItems as any[]).length > 0 ? (dbItems as any[]) : TESTIMONIALS;

  const filtered = source.filter((t: any) => {
    if (filter === "All") return true;
    if (filter === "Recent") return t.recent ?? false;
    return (t.category ?? "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="bg-white">
      <SiteNavbar />
      {/* Hero */}
      <section className="bg-[#0D0D0D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <nav
            className="mb-6 flex items-center justify-center gap-2 text-sm text-white/60"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-[#E8651A]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Testimonials</span>
          </nav>
          <h1 className="text-4xl font-bold md:text-6xl">Pilgrim Stories</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
            Real experiences from our blessed travelers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#FFF8F2]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-[#E8651A] md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#0D0D0D] md:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters + grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-wrap justify-center gap-3">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "border-[#E8651A] bg-[#E8651A] text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-[#E8651A] hover:text-[#E8651A]"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-10 text-center text-neutral-500">
              No testimonials in this category yet.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8651A] px-4 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Begin Your Sacred Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Join thousands of blessed travelers who trusted us with their
            pilgrimage.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90"
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
