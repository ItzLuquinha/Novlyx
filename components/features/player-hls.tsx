"use client";

import { useEffect, useRef, useState } from "react";
import { urlHttpSegura } from "@/lib/url-segura";

interface PlayerHlsProps {
  src: string;
  titulo?: string;
}

function extrairYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) return u.searchParams.get("v");
      if (u.pathname.startsWith("/live/"))
        return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/embed/"))
        return u.pathname.split("/")[2] || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function PlayerHls({ src, titulo }: PlayerHlsProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const srcSeguro = urlHttpSegura(src);
  const ytId = srcSeguro ? extrairYoutubeId(srcSeguro) : null;
  const isYoutube = Boolean(
    srcSeguro && (/youtube\.com|youtu\.be/i.test(srcSeguro) || ytId)
  );

  useEffect(() => {
    if (!srcSeguro || isYoutube) {
      setCarregando(false);
      return;
    }

    // Após o guard, TypeScript trata como string
    const url: string = srcSeguro;
    const video = videoRef.current;
    if (!video) return;

    setErro(null);
    setCarregando(true);
    let hls: { destroy: () => void } | null = null;
    let cancelado = false;

    async function iniciar() {
      try {
        if (video!.canPlayType("application/vnd.apple.mpegurl")) {
          video!.src = url;
          await video!.play().catch(() => undefined);
          if (!cancelado) setCarregando(false);
          return;
        }

        const Hls = (await import("hls.js")).default;
        if (Hls.isSupported()) {
          const instance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hls = instance;
          instance.loadSource(url);
          instance.attachMedia(video!);
          instance.on(Hls.Events.MANIFEST_PARSED, () => {
            video!
              .play()
              .catch(() => undefined)
              .finally(() => {
                if (!cancelado) setCarregando(false);
              });
          });
          instance.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) {
              setErro(
                "Este stream falhou (offline, bloqueado ou indisponível)."
              );
              setCarregando(false);
            }
          });
        } else {
          setErro("Seu navegador não suporta HLS.");
          setCarregando(false);
        }
      } catch {
        setErro("Não foi possível iniciar o player.");
        setCarregando(false);
      }
    }

    void iniciar();

    return () => {
      cancelado = true;
      hls?.destroy();
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [srcSeguro, isYoutube]);

  if (!srcSeguro) {
    return (
      <div className="flex h-full items-center justify-center bg-black p-6 text-center text-sm text-white/60">
        URL de stream inválida.
      </div>
    );
  }

  if (isYoutube) {
    if (ytId && /^[\w-]{6,20}$/.test(ytId)) {
      return (
        <iframe
          title={titulo || "YouTube"}
          src={`https://www.youtube.com/embed/${encodeURIComponent(ytId)}?autoplay=1`}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      );
    }
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-black p-6 text-center">
        <p className="text-sm text-white/70">
          Este canal transmite pelo YouTube.
        </p>
        <a
          href={srcSeguro}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-novlyx-gold px-4 py-2 text-sm font-medium text-black hover:bg-novlyx-gold/90"
        >
          Abrir no YouTube
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        controls
        playsInline
        autoPlay
        title={titulo}
      />
      {carregando && !erro && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white/70">
          Carregando stream…
        </div>
      )}
      {erro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
          <p className="max-w-sm text-sm text-white/70">{erro}</p>
        </div>
      )}
    </div>
  );
}
