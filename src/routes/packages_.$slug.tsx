import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { usePackage } from "@/hooks/use-content";
import { toast } from "sonner";
import { z } from "zod";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronRight,
  XCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

type Pkg = {
  slug: string; name: string; type: string; price: string; duration: string;
  image: string | null; description: string | null; is_featured: boolean;
  highlights: string[]; includes: string[]; excludes: string[];
  itinerary: { day: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

export const Route = createFileRoute("/packages_/$slug")({
  head: ({ params }) => {
    const title = `Package — Rizdeen Travels`;
    return {
      meta: [
        { title },
        { name: "description", content: `Package details for ${params.slug}` },
        { property: "og:title", content: title },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#0D0D0D]">Package not found</h1>
        <Link to="/packages" className="mt-4 inline-block text-[#E8651A] underline">
          ← Back to packages
        </Link>
      </div>
    </div>
  ),
  component: PackageDetailPage,
});

const enquirySchema = z.object({
  full_name: z.string().trim().min(2, "Name is too short").max(120),
  phone: z.string().trim().min(4, "Phone is required").max(30),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  persons: z.coerce.number().int().min(1).max(50).optional(),
  preferred_date: z.string().optional(),
  message: z.string().max(1000).optional(),
});

type Tab = "overview" | "itinerary" | "includes" | "faqs";

function PackageDetailPage() {
  const { slug } = Route.useParams();
  const { data: pkgRaw, isLoading } = usePackage(slug);
  const pkg = pkgRaw as Pkg | null | undefined;
  const [tab, setTab] = React.useState<Tab>("overview");
  const [submitting, setSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "includes", label: "Includes/Excludes" },
    { id: "faqs", label: "FAQs" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: String(fd.get("full_name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      persons: fd.get("persons") ? Number(fd.get("persons")) : undefined,
      preferred_date: String(fd.get("preferred_date") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      package_name: pkg?.name ?? "Unknown",
      package_slug: pkg?.slug ?? slug,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      persons: parsed.data.persons ?? null,
      preferred_date: parsed.data.preferred_date || null,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit enquiry. Please try again.");
      return;
    }
    toast.success("Enquiry submitted! We'll contact you soon.");
    formRef.current?.reset();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Loading…</div>;
  }
  if (!pkg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0D0D0D]">Package not found</h1>
          <Link to="/packages" className="mt-4 inline-block text-[#E8651A] underline">← Back to packages</Link>
        </div>
      </div>
    );
  }

  const waMessage = encodeURIComponent(`Assalamu Alaikum, I'm interested in ${pkg.name} (${pkg.price}).`);

  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      <SiteNavbar />
      {/* Breadcrumb */}
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-[#E8651A]">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/packages" className="hover:text-[#E8651A]">Packages</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#0D0D0D]">{pkg.name}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}
        <div>
          <div className="relative overflow-hidden rounded-2xl">
            <img src={pkg.image ?? undefined} alt={pkg.name} className="h-72 w-full object-cover md:h-96" />
            <span className="absolute left-4 top-4 rounded-md bg-[#E8651A] px-3 py-1 text-xs font-bold tracking-widest text-white shadow">
              {pkg.type}
            </span>
            {pkg.is_featured && (
              <div className="pointer-events-none absolute -right-14 top-8 w-52 rotate-45 bg-[#E8651A] py-1.5 text-center text-xs font-bold tracking-wider text-white shadow-lg">
                MOST POPULAR
              </div>
            )}
          </div>

          <div className="mt-6">
            <h1 className="font-serif text-3xl font-bold text-[#0D0D0D] md:text-5xl">{pkg.name}</h1>
            <div className="mt-3 flex flex-wrap items-baseline gap-4">
              <span className="text-4xl font-extrabold text-[#E8651A]">{pkg.price}</span>
              <span className="text-sm text-muted-foreground">/person</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0D0D0D] shadow-sm ring-1 ring-black/5">
                <CalendarIcon className="h-4 w-4 text-[#E8651A]" /> {pkg.duration}
              </span>
              {pkg.highlights.slice(0, 2).map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0D0D0D] shadow-sm ring-1 ring-black/5"
                >
                  <Sparkles className="h-4 w-4 text-[#E8651A]" /> {h}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-black/10">
            <div className="flex flex-wrap gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-4 py-3 text-sm font-semibold transition ${
                    tab === t.id ? "text-[#E8651A]" : "text-[#0D0D0D]/60 hover:text-[#0D0D0D]"
                  }`}
                >
                  {t.label}
                  {tab === t.id && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[#E8651A]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            {tab === "overview" && (
              <div>
                <p className="text-base leading-relaxed text-gray-700">{pkg.description}</p>
                <h3 className="mt-6 text-lg font-bold text-[#0D0D0D]">Key Highlights</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {pkg.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-start gap-3 rounded-xl bg-[#FFF8F2] p-4 ring-1 ring-black/5"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#E8651A]" />
                      <span className="text-sm font-medium text-[#0D0D0D]">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "itinerary" && (
              <Accordion type="single" collapsible className="w-full">
                {pkg.itinerary.map((it, i) => (
                  <AccordionItem key={i} value={`day-${i}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-baseline gap-3">
                        <span className="text-sm font-bold text-[#E8651A]">{it.day}</span>
                        <span className="font-semibold text-[#0D0D0D]">{it.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">{it.desc}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {tab === "includes" && (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-bold text-[#0D0D0D]">What's Included</h3>
                  <ul className="space-y-3">
                    {pkg.includes.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-bold text-[#0D0D0D]">What's Excluded</h3>
                  <ul className="space-y-3">
                    {pkg.excludes.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-sm text-gray-700">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "faqs" && (
              <Accordion type="single" collapsible className="w-full">
                {pkg.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-semibold text-[#0D0D0D]">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>

        {/* RIGHT — sticky form */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div
            id="enquiry"
            className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5"
          >
            <h3 className="text-xl font-bold text-[#0D0D0D]">Book This Package</h3>
            <p className="mt-1 text-sm text-muted-foreground">{pkg.name}</p>
            <p className="mt-2 text-3xl font-extrabold text-[#E8651A]">{pkg.price}</p>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" required maxLength={120} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required maxLength={30} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" maxLength={255} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="persons">Persons</Label>
                  <Input id="persons" name="persons" type="number" min={1} max={50} defaultValue={1} />
                </div>
                <div>
                  <Label htmlFor="preferred_date">Preferred Date</Label>
                  <Input id="preferred_date" name="preferred_date" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={3} maxLength={1000} />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#E8651A] py-6 text-base font-bold text-white hover:bg-[#E8651A]/90"
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </Button>
            </form>

            <a
              href={`https://wa.me/8801711366488?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 text-sm font-bold text-white transition hover:bg-[#25D366]/90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </aside>
      </div>

      {/* Other packages CTA */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-muted-foreground">
            Looking at other options?{" "}
            <Link to="/packages" className="font-semibold text-[#E8651A] hover:underline">
              View all packages →
            </Link>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
