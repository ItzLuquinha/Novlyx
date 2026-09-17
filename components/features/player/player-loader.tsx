"use client";

import { useEffect, useState } from "react";
import type { ConteudoDetalhado, CategoriaConteudo } from "@/types";
import { PlayerPageClient } from "@/components/features/player/player-page-client";

function catOk(v: string): v is CategoriaConteudo {
  return v === "filme" || v === "serie" || v === "anime" || v === "dorama";
}

async function carregar(
  categoriaRaw: string,
  idRaw: string
): Promise<ConteudoDetalhado> {
  const categoria = catOk(categoriaRaw) ? categoriaRaw : "serie";
  const id = decodeURIComponent(idRaw || "").trim();
  if (!id) throw new Error("ID vazio");

  const { idsParaConsulta } = await import("@/lib/identidade");
  const { mapearDetalhe } = await import("@/lib/adapters/2embed");

  const ids = idsParaConsulta(id);
  const imdb = ids.imdbId;
  const tmdb = ids.tmdbId;
  const ehFilme = categoria === "filme";
  const base = ehFilme ? "/api/proxy/movie" : "/api/proxy/tv";

  const urls: string[] = [];
  if (imdb) urls.push(`${base}?imdb_id=${encodeURIComponent(imdb)}`);
  if (tmdb) urls.push(`${base}?tmdb_id=${encodeURIComponent(tmdb)}`);
  if (!imdb && !tmdb) {
    if (/^tt\d+/i.test(id)) urls.push(`${base}?imdb_id=${encodeURIComponent(id)}`);
    else if (/^\d+$/.test(id)) urls.push(`${base}?tmdb_id=${encodeURIComponent(id)}`);
  }
  if (urls.length === 0) throw new Error(`Sem ID valido: ${id}`);

  for (const url of urls) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) continue;
    const data = await res.json();
    if (data && (data.tmdb_id || data.imdb_id || data.name || data.title)) {
      return mapearDetalhe(data, categoria);
    }
  }
  throw new Error("Titulo nao encontrado");
}

export function PlayerLoader({
  categoria,
  id,
}: {
  categoria: string;
  id: string;
}) {
  const [conteudo, setConteudo] = useState<ConteudoDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    carregar(categoria, id)
      .then((d) => {
        if (!cancel) setConteudo(d);
      })
      .catch((e) => {
        if (!cancel) setErro(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancel = true;
    };
  }, [categoria, id]);

  if (erro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black text-center text-white">
        <p>Nao foi possivel abrir o player</p>
        <p className="text-sm text-white/50">{erro}</p>
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
