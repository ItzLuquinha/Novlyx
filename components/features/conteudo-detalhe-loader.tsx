"use client";

import { useEffect, useState } from "react";
import type { ConteudoDetalhado, CategoriaConteudo } from "@/types";
import { ConteudoDetalheClient } from "@/components/features/conteudo-detalhe-client";

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

  let lastStatus = 0;
  for (const url of urls) {
    const res = await fetch(url, { cache: "no-store" });
    lastStatus = res.status;
    if (!res.ok) continue;
    const data = await res.json();
    if (data && (data.tmdb_id || data.imdb_id || data.name || data.title)) {
      return mapearDetalhe(data, categoria);
    }
  }
  throw new Error(`Titulo nao encontrado (HTTP ${lastStatus})`);
}

export function ConteudoDetalheLoader({
  categoria,
  id,
}: {
  categoria: string;
  id: string;
}) {
  const [conteudo, setConteudo] = useState<ConteudoDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancel = false;
    setCarregando(true);
    setErro(null);
    setConteudo(null);

    carregar(categoria, id)
      .then((d) => {
        if (!cancel) setConteudo(d);
      })
      .catch((e) => {
        if (!cancel) setErro(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancel) setCarregando(false);
      });

    return () => {
      cancel = true;
    };
  }, [categoria, id]);

  if (carregando) {
    return (
      <div className="container space-y-4 py-16">
        <div className="h-48 animate-pulse rounded-xl bg-white/5" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="h-24 animate-pulse rounded bg-white/5" />
        <p className="text-center text-sm text-white/40">
          Carregando {categoria}/{id}...
        </p>
      </div>
    );
  }

  if (erro || !conteudo) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-lg font-medium text-white">
          Nao foi possivel abrir este titulo
        </p>
        <p className="max-w-md text-sm text-white/50">{erro || "Indisponivel"}</p>
        <p className="text-xs text-white/30">
          {categoria} / {id}
        </p>
        <a href="/animes" className="text-sm text-violet-300 underline">
          Voltar aos animes
        </a>
      </div>
    );
  }

  return <ConteudoDetalheClient conteudo={conteudo} />;
}
