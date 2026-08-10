"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function youtubeId(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]!;
    }
  } catch {
    /* ignore */
  }
  // bare id
  if (/^[\w-]{11}$/.test(url)) return url;
  return null;
}

export function BotaoTrailer({ trailerUrl }: { trailerUrl?: string }) {
  const [aberto, setAberto] = useState(false);
  const id = youtubeId(trailerUrl);
  if (!id) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="gap-2 border-white/20"
        onClick={() => setAberto(true)}
      >
        <Play className="h-4 w-4" />
        Trailer
      </Button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Trailer"
          onClick={() => setAberto(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-black"
              onClick={() => setAberto(false)}
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
                title="Trailer"
                className="h-full w-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
