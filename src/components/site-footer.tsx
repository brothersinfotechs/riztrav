import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Youtube,
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logo from "@/assets/rizdeen-logo.png";

const quickLinks: Array<[string, string]> = [
  ["Packages", "/packages"],
  ["Services", "/services"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];

const packageLinks: Array<[string, string]> = [
  ["Standard Umrah", "/packages/standard-umrah"],
  ["Premium Umrah", "/packages/premium-umrah"],
  ["Hajj Standard", "/packages/hajj-standard"],
  ["Hajj Premium", "/packages/hajj-premium"],
];

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
      className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[#E8651A] hover:bg-[#E8651A]"
    >
      {children}
    </a>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-[#E8651A]"
      >
        <ArrowRight className="h-3 w-3 text-[#E8651A] opacity-0 transition group-hover:opacity-100" />
        <span>{label}</span>
      </Link>
    </li>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Subscribed! We'll keep you posted.");
    setEmail("");
  };

  return (
    <footer className="mt-auto">
      {/* Newsletter strip */}
      <div className="bg-[#E8651A]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:py-8">
          <div className="text-center md:text-left">
            <p className="text-base font-semibold text-white md:text-lg">
              Stay updated with our latest packages & offers
            </p>
            <p className="mt-1 text-sm text-white/85">
              Get Hajj & Umrah deals straight to your inbox.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md items-center gap-2"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="h-11 flex-1 border-0 bg-white text-[#0D0D0D] placeholder:text-black/50 focus-visible:ring-2 focus-visible:ring-black"
            />
            <Button
              type="submit"
              className="h-11 bg-[#0D0D0D] px-6 text-white hover:bg-black"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-[#0D0D0D] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="Rizdeen Travels">
              <img src={logo} alt="Rizdeen Travels" className="h-12 w-auto bg-white rounded-md p-2" />
            </Link>
            <p className="mt-3 text-sm font-medium text-white/90">
              Your trusted Hajj & Umrah partner since 2005
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Government-approved travel agency providing seamless pilgrimage
              experiences for Bangladeshi Muslims worldwide.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#E8651A]/60 bg-[#E8651A]/10 px-3 py-1.5 text-xs font-semibold text-[#E8651A]">
              <ShieldCheck className="h-4 w-4" />
              Ministry of Hajj License No: 632
            </div>
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon
                href="https://facebook.com"
                label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" label="YouTube">
                <Youtube className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon
                href="https://wa.me/8801711366488"
                label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon
                href="https://instagram.com"
                label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#E8651A]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(([label, to]) => (
                <FooterLink key={to} to={to} label={label} />
              ))}
            </ul>
          </div>

          {/* Our Packages */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#E8651A]">
              Our Packages
            </h3>
            <ul className="space-y-3">
              {packageLinks.map(([label, to]) => (
                <FooterLink key={to} to={to} label={label} />
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#E8651A]">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#E8651A]" />
                <a
                  href="tel:+8801711366488"
                  className="hover:text-[#E8651A]"
                >
                  +880 1711-366488
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#E8651A]" />
                <a
                  href="mailto:rizdeentravels@gmail.com"
                  className="hover:text-[#E8651A]"
                >
                  rizdeentravels@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E8651A]" />
                <span>Level 14, H.M Plaza, Sector 3, Uttara, Dhaka, Bangladesh, 1230</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#E8651A]" />
                <span>Sat–Thu: 9AM–8PM · Fri: 2PM–8PM</span>
              </li>
            </ul>
            <a
              href="https://wa.me/8801711366488"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us Now
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#222] bg-[#0a0a0a]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/70 md:flex-row">
            <p>
              © {new Date().getFullYear()} Rizdeen Travels. All rights
              reserved.
            </p>
            <p className="text-white/60">
              Ministry of Hajj Licensed Agency
            </p>
            <p className="flex items-center gap-3">
              <a href="#" className="hover:text-[#E8651A]">
                Privacy Policy
              </a>
              <span className="text-white/30">|</span>
              <a href="#" className="hover:text-[#E8651A]">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
