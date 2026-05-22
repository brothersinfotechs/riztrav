import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/rizdeen-logo-dark.png";

const LINKS: Array<[string, string]> = [
  ["Home", "/"],
  ["Packages", "/packages"],
  ["Services", "/services"],
  ["Gallery", "/gallery"],
  ["Testimonials", "/testimonials"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[9999] bg-white animate-nav-in transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/40" : ""
        }`}
        style={{ height: 70 }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 text-[#0D0D0D]">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="Rizdeen Travels">
            <img src={logo} alt="Rizdeen Travels" className="h-10 w-auto md:h-12" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 text-sm lg:flex">
            {LINKS.map(([l, h]) => (
              <Link
                key={h}
                to={h}
                className={`transition-colors hover:text-[#E8651A] ${
                  isActive(h) ? "text-[#E8651A] font-semibold" : "text-[#0D0D0D]"
                }`}
              >
                {l}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+8801711366488"
              className="hidden items-center gap-1.5 text-sm text-[#0D0D0D]/80 hover:text-[#E8651A] md:flex"
            >
              <Phone className="h-4 w-4" /> +880 1711-366488
            </a>
            <Button
              asChild
              size="sm"
              className="hidden bg-[#E8651A] text-white hover:bg-[#E8651A]/90 sm:inline-flex"
            >
              <Link to="/contact">Book Now</Link>
            </Button>
            <button
              aria-label="Toggle menu"
              className="text-[#0D0D0D] lg:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="bg-white lg:hidden border-t border-black/10">
            <nav className="flex flex-col px-4 py-2 text-sm">
              {LINKS.map(([l, h]) => (
                <Link
                  key={h}
                  to={h}
                  onClick={() => setOpen(false)}
                  className={`border-b border-black/10 py-3 transition-colors ${
                    isActive(h) ? "text-[#E8651A] font-semibold" : "text-[#0D0D0D] hover:text-[#E8651A]"
                  }`}
                >
                  {l}
                </Link>
              ))}
              <a
                href="tel:+8801711366488"
                className="flex items-center gap-2 py-3 text-[#0D0D0D]/80"
              >
                <Phone className="h-4 w-4" /> +880 1711-366488
              </a>
            </nav>
          </div>
        )}
      </header>
      {/* Spacer so content starts below the fixed navbar */}
      <div aria-hidden style={{ height: 70 }} />
    </>
  );
}
