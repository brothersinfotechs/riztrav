import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { useGallery } from "@/hooks/use-content";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Rizdeen Travels" },
      { name: "description", content: "Moments from our blessed journeys to the holy lands of Makkah and Madinah." },
      { property: "og:title", content: "Gallery — Rizdeen Travels" },
      { property: "og:description", content: "Moments from our blessed journeys to the holy lands." },
    ],
  }),
  component: GalleryPage,
});

type Item = { url: string; category: string; caption: string };

const FALLBACK_IMAGES: Item[] = [
  { url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800", category: "MAKKAH", caption: "Masjid al-Haram, Makkah" },
  { url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800", category: "UMRAH", caption: "Pilgrims performing Tawaf" },
  { url: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=800", category: "MADINAH", caption: "Masjid an-Nabawi, Madinah" },
  { url: "https://images.unsplash.com/photo-1549813069-c09b4a5d2e68?w=800", category: "HAJJ", caption: "Hajj gathering at Arafat" },
  { url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800", category: "PILGRIMS", caption: "Bangladesh pilgrims group" },
  { url: "https://images.unsplash.com/photo-1573984619827-e09f0c47c4f0?w=800", category: "MAKKAH", caption: "Kaaba at night" },
];

const FILTERS = ["ALL", "HAJJ", "UMRAH", "MAKKAH", "MADINAH", "PILGRIMS"];

function resolveImageUrl(raw: string): string {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const { data } = supabase.storage.from("gallery").getPublicUrl(raw);
  return data.publicUrl;
}

function GalleryPage() {
  const [filter, setFilter] = useState("ALL");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: dbItems } = useGallery();

  const allItems = useMemo<Item[]>(() => {
    if (dbItems && dbItems.length > 0) {
      return dbItems.map((r) => ({
        url: resolveImageUrl(r.image_url),
        category: (r.category ?? "OTHER").toUpperCase(),
        caption: r.caption ?? "",
      }));
    }
    return FALLBACK_IMAGES;
  }, [dbItems]);

  const items = filter === "ALL" ? allItems : allItems.filter((i) => i.category === filter);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(() => setLightbox(i => (i === null ? i : (i + 1) % items.length)), [items.length]);
  const prev = useCallback(() => setLightbox(i => (i === null ? i : (i - 1 + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close, next, prev]);

  // swipe
  const [touchX, setTouchX] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      {/* Hero */}
      <section className="bg-[#0D0D0D] py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="mb-6 text-sm text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-white">Gallery</span>
          </nav>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Our Gallery</h1>
          <p className="text-lg text-white/70">Moments from our blessed journeys to the holy lands</p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-20 border-b border-black/5 bg-white py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2 px-4">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === f ? "bg-[#E8651A] text-white shadow" : "bg-black/5 text-black hover:bg-black/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="px-3 py-10">
        <div className="mx-auto max-w-7xl columns-1 gap-2 sm:columns-2 lg:columns-3">
          {items.map((img, idx) => (
            <button
              key={img.url + idx}
              onClick={() => setLightbox(idx)}
              className="group relative mb-2 block w-full overflow-hidden rounded-xl"
            >
              <img
                src={img.url}
                alt={img.caption}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                <ZoomIn className="h-10 w-10 text-white" />
              </div>
              <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#E8651A] px-3 py-1 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                {img.category}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Upload CTA */}
      <section className="bg-[#E8651A] px-4 py-16 text-center text-white">
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">Want to share your journey?</h2>
        <p className="mb-6 text-white/90">Send us your photos and we'll feature them here</p>
        <a
          href="https://wa.me/8801711366488"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-black/80"
        >
          Share Your Photos
        </a>
      </section>

      {/* Lightbox */}
      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={close}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (dx > 50) prev();
            else if (dx < -50) next();
            setTouchX(null);
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="max-w-5xl text-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[lightbox].url.replace("w=800", "w=1600").replace("w=600", "w=1600")}
              alt={items[lightbox].caption}
              className="mx-auto max-h-[80vh] rounded-lg object-contain"
            />
            <div className="mt-4 flex flex-col items-center gap-2">
              <span className="rounded-full bg-[#E8651A] px-3 py-1 text-xs font-bold text-white">
                {items[lightbox].category}
              </span>
              <p className="text-white">{items[lightbox].caption}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
