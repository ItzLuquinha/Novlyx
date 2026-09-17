"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { ConteudoDetalhado, CategoriaConteudo } from "@/types";

const PlayerPageClient = dynamic(
  () =>
    import("@/components/features/player/player-page-client").then(
      (m) => m.PlayerPageClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/40">
        Montando player...
      </div>
    ),
  }
);

function catOk(v: string): v is CategoriaConteudo {
  return v === "filme" || v === "serie" || v === "anime" || v === "dorama";
}

function Corpo() {
  const sp = useSearchParams();
  const categoriaRaw = sp.get("c") || sp.get("categoria") || "serie";
  const idRaw = sp.get("id") || "";
  const [conteudo, setConteudo] = useState<ConteudoDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    const categoria = catOk(categoriaRaw) ? categoriaRaw : "serie";
    const id = decodeURIComponent(idRaw).trim();
    if (!id) {
      setErro("ID ausente");
      return;
    }

    (async () => {
      try {
        const { idsParaConsulta } = await import("@/lib/identidade");
        const { mapearDetalhe } = await import("@/lib/adapters/2embed");
        const ids = idsParaConsulta(id);
        const ehFilme = categoria === "filme";
        const base = ehFilme ? "/api/proxy/movie" : "/api/proxy/tv";
        const urls: string[] = [];
        if (ids.imdbId) urls.push(`${base}?imdb_id=${encodeURIComponent(ids.imdbId)}`);
        if (ids.tmdbId) urls.push(`${base}?tmdb_id=${encodeURIComponent(ids.tmdbId)}`);
        if (!ids.imdbId && !ids.tmdbId) {
          if (/^tt\d+/i.test(id)) urls.push(`${base}?imdb_id=${encodeURIComponent(id)}`);
          else if (/^\d+$/.test(id)) urls.push(`${base}?tmdb_id=${encodeURIComponent(id)}`);
        }
        for (const url of urls) {
          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) continue;
          const data = await res.json();
          if (data && (data.tmdb_id || data.imdb_id || data.name || data.title)) {
            if (!cancel) setConteudo(mapearDetalhe(data, categoria));
            return;
          }
        }
        throw new Error("Titulo nao encontrado");
      } catch (e) {
        if (!cancel) setErro(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancel = true;
    };
  }, [categoriaRaw, idRaw]);

  if (erro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black text-white">
        <p>{erro}</p>
        <a href="/" className="text-sm text-violet-300 underline">
          Voltar
        </a>
      </div>
    );
  }

  if (!conteudo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/40">
        Carregando player...
      </div>
    );
  }

  return <PlayerPageClient conteudo={conteudo} />;
}

export default function PaginaAssistir() {
  return (
    <main className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/40">
            Carregando...
          </div>
        }
      >
        <Corpo />
      </Suspense>
    </main>
  );
}
