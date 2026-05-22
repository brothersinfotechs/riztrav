import { useTeam } from "@/hooks/use-content";
import { Reveal } from "@/components/reveal";

function withCacheBust(url: string) {
  if (!url) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${Date.now()}`;
}

function Initial({ name }: { name: string }) {
  const letter = (name?.trim()?.[0] ?? "?").toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-5xl font-bold text-neutral-500">
      {letter}
    </div>
  );
}

export function TeamGrid() {
  const { data: members = [], isLoading } = useTeam();

  if (isLoading) {
    return (
      <div className="mt-14 grid gap-6 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-14 -mx-4 overflow-x-auto px-4 pb-4 md:mx-0 md:overflow-visible md:px-0">
      <div className="flex gap-6 md:grid md:grid-cols-5">
        {members.map((m: any, idx: number) => (
          <Reveal
            key={m.id}
            variant="up"
            delay={idx * 150}
            className="group flex w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 hover:-translate-y-1 hover:shadow-xl md:w-auto"
          >
            <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
              {m.photo_url ? (
                <img
                  src={withCacheBust(m.photo_url)}
                  alt={m.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <Initial name={m.name} />
              )}
            </div>
            <div className="flex flex-1 flex-col p-5 text-center">
              <h3 className="text-base font-bold text-[#0D0D0D]">{m.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#E8651A]">{m.role}</p>
              {m.bio ? (
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#666666]">
                  {m.bio}
                </p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
