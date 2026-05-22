import { Star, Quote } from "lucide-react";

export type TestimonialCardData = {
  name: string;
  location?: string | null;
  rating: number;
  text?: string | null;
  review?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
};

function withCacheBust(url: string) {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}

export function TestimonialCard({ t }: { t: TestimonialCardData }) {
  const body = t.text ?? t.review ?? "";
  const rawAvatar = t.avatar ?? t.avatar_url ?? "";
  const avatar = rawAvatar ? withCacheBust(rawAvatar) : "";
  const initial = (t.name?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg">
      <Quote
        className="h-8 w-8 -scale-x-100 text-[#E8651A]"
        strokeWidth={2.5}
      />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
        &ldquo;{body}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-4">
        {avatar ? (
          <img
            src={avatar}
            alt={t.name}
            loading="lazy"
            className="h-10 w-10 rounded-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8651A] text-sm font-bold text-white">
            {initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#0D0D0D]">{t.name}</p>
          {t.location && (
            <p className="truncate text-xs text-neutral-500">{t.location}</p>
          )}
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: t.rating || 0 }).map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5 fill-[#E8651A] text-[#E8651A]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
