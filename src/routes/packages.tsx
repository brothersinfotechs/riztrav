import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { usePackages } from "@/hooks/use-content";
type PackageType = "HAJJ" | "UMRAH";
import { Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Hajj & Umrah Packages — Rizdeen Travels" },
      { name: "description", content: "Browse our complete range of government-approved Hajj and Umrah packages from Bangladesh." },
      { property: "og:title", content: "Hajj & Umrah Packages — Rizdeen Travels" },
      { property: "og:description", content: "Choose the perfect Hajj or Umrah package for your sacred journey." },
    ],
  }),
  component: PackagesPage,
});

type Filter = "ALL" | PackageType;

function PackagesPage() {
  const [filter, setFilter] = React.useState<Filter>("ALL");
  const { data: packages = [] } = usePackages();
  const visible = packages.filter((p: any) => filter === "ALL" || p.type === filter);
  const tabs: Filter[] = ["ALL", "HAJJ", "UMRAH"];

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-[#0D0D0D] px-4 py-24 text-center text-white"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(232,101,26,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05), transparent 50%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 flex justify-center gap-2 text-xs uppercase tracking-widest text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">Packages</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-6xl">
            Our Hajj & Umrah Packages
          </h1>
          <p className="mt-4 text-lg text-white/75">
            Choose the perfect package for your sacred journey
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="border-b border-black/5 bg-white py-6">
        <div className="mx-auto inline-flex w-full justify-center">
          <div className="inline-flex rounded-full border border-black/10 bg-[#FFF8F2] p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-full px-6 py-2 text-sm font-semibold tracking-wide transition ${
                  filter === t
                    ? "bg-[#E8651A] text-white shadow"
                    : "text-[#0D0D0D]/70 hover:text-[#0D0D0D]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p: any, idx: number) => {
            const isLast = visible.length % 3 === 1 && idx === visible.length - 1;
            const highlights: string[] = Array.isArray(p.highlights) ? p.highlights : [];
            return (
              <article
                key={p.slug}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isLast ? "lg:col-start-2" : ""
                }`}
              >
                <Link
                  to="/packages/$slug"
                  params={{ slug: p.slug }}
                  className="absolute inset-0 z-0"
                  aria-label={p.name}
                />
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={p.image ?? undefined}
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
                    {highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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
              </article>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
