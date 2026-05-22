import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-content";
import { toast } from "sonner";
import { z } from "zod";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Youtube,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Rizdeen Travels" },
      {
        name: "description",
        content:
          "Get in touch with Rizdeen Travels for Hajj & Umrah packages. Call, email, or send us a message — our team replies within 24 hours.",
      },
      { property: "og:title", content: "Contact Us — Rizdeen Travels" },
      {
        property: "og:description",
        content: "We're here to help you plan your sacred journey.",
      },
    ],
  }),
  component: ContactPage,
});

const PACKAGE_OPTIONS = [
  "Economy Umrah",
  "Standard Umrah",
  "Premium Umrah",
  "Short Umrah",
  "Hajj Economy",
  "Hajj Standard",
  "Hajj Premium",
  "General Inquiry",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is too short").max(120),
  phone: z.string().trim().min(4, "Phone is required").max(30),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  package_name: z.string().trim().min(1).max(200),
  persons: z.coerce.number().int().min(1).max(50).optional(),
  preferred_date: z.string().optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const general = (settings?.general as any) ?? {};
  const social = (settings?.social as any) ?? {};
  const address = general.address ?? "Room 11, Level 14, H M Plaza, Road 2, Sector 3, Uttara C/A, Dhaka 1230, Bangladesh";
  const phone1 = general.phone ?? "+880 1711-366488";
  const email1 = general.email ?? "rizdeentravels@gmail.com";

  const [submitting, setSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: String(fd.get("full_name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      package_name: String(fd.get("package_name") ?? "General Inquiry"),
      persons: fd.get("persons") ? Number(fd.get("persons")) : undefined,
      preferred_date: String(fd.get("preferred_date") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      package_name: parsed.data.package_name,
      package_slug: null,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      persons: parsed.data.persons ?? null,
      preferred_date: parsed.data.preferred_date || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send message. Please try again.");
      return;
    }
    toast.success("Message sent! We'll contact you within 24 hours.");
    formRef.current?.reset();
  };

  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <SiteNavbar />
      {/* Hero */}
      <section className="bg-[#0D0D0D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <nav className="mb-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="text-4xl font-bold md:text-6xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            We're here to help you plan your sacred journey
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Info */}
          <div className="rounded-2xl bg-[#0D0D0D] p-8 text-white">
            <h3 className="text-2xl font-bold">Get In Touch</h3>
            <p className="mt-2 text-white/70">
              Our team is available 6 days a week to answer your questions about
              Hajj & Umrah packages.
            </p>

            <div className="mt-8 space-y-5">
              <InfoCard icon={<Phone className="h-5 w-5" />} title="Phone">
                <a href={`tel:${phone1.replace(/\s/g, "")}`} className="block hover:text-[#E8651A]">{phone1}</a>
                <span className="block text-white/60">​</span>
              </InfoCard>
              <InfoCard icon={<Mail className="h-5 w-5" />} title="Email">
                <a href={`mailto:${email1}`} className="block hover:text-[#E8651A]">{email1}</a>
                <a href="mailto:rizdeentravels@gmail.com" className="block hover:text-[#E8651A]">​</a>
              </InfoCard>
              <InfoCard icon={<MapPin className="h-5 w-5" />} title="Address">
                <span className="block">{address}</span>
              </InfoCard>
              <InfoCard icon={<Clock className="h-5 w-5" />} title="Office Hours">
                <span className="block">Saturday – Thursday: 9AM – 8PM</span>
                <span className="block">Friday: 2PM – 8PM</span>
              </InfoCard>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <SocialIcon href={social.facebook ?? "https://facebook.com"} label="Facebook">
                <Facebook className="h-5 w-5" />
              </SocialIcon>
              <SocialIcon href={social.youtube ?? "https://youtube.com"} label="YouTube">
                <Youtube className="h-5 w-5" />
              </SocialIcon>
              <SocialIcon href={`https://wa.me/${phone1.replace(/[^\d]/g, "")}`} label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </SocialIcon>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl">
              <iframe
                title="Office location"
                src="https://www.google.com/maps?q=Uttara+Sector+3+Dhaka+Bangladesh&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5">
            <h3 className="text-2xl font-bold text-[#0D0D0D]">Send Us a Message</h3>
            <p className="mt-2 text-sm text-gray-600">
              Fill the form and we'll get back to you within 24 hours
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" name="full_name" required maxLength={120} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required maxLength={30} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" maxLength={255} />
                </div>
              </div>
              <div>
                <Label htmlFor="package_name">Package Interest</Label>
                <select
                  id="package_name"
                  name="package_name"
                  defaultValue="General Inquiry"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {PACKAGE_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="persons">Number of Persons</Label>
                  <Input id="persons" name="persons" type="number" min={1} max={50} defaultValue={1} />
                </div>
                <div>
                  <Label htmlFor="preferred_date">Preferred Travel Date</Label>
                  <Input id="preferred_date" name="preferred_date" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" name="message" rows={4} required maxLength={1000} />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#E8651A] text-white hover:bg-[#E8651A]/90"
              >
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="bg-[#FFF8F2]">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold md:text-3xl">Frequently Asked</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                q: "How do I book a package?",
                a: "Browse our packages, click Book Now, fill the enquiry form. Our team will contact you within 24 hours.",
              },
              {
                q: "What documents are needed for Umrah?",
                a: "Valid passport (6+ months), passport-size photos, vaccination certificate, and NID copy.",
              },
              {
                q: "Do you offer installment payment?",
                a: "Yes, we offer flexible payment plans. Contact us for details.",
              },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold text-[#0D0D0D]">{f.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8651A]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Begin Your Sacred Journey?
          </h2>
          <Button
            asChild
            size="lg"
            className="bg-[#0D0D0D] text-white hover:bg-[#0D0D0D]/90"
          >
            <Link to="/packages">View Packages</Link>
          </Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8651A] text-white">
        {icon}
      </div>
      <div className="text-sm">
        <p className="font-semibold text-white">{title}</p>
        <div className="mt-1 space-y-0.5 text-white/80">{children}</div>
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-[#E8651A] text-white transition hover:scale-110"
    >
      {children}
    </a>
  );
}
