"use client";

import { useEffect, useState } from "react";
import { ConteudoDetalhado, CategoriaConteudo } from "@/types";
import { PlayerPageClient } from "@/components/features/player/player-page-client";
import { categoriaRotaSegura, idConteudoSeguro } from "@/lib/url-segura";
import { idsParaConsulta } from "@/lib/identidade";
import { EmbedItem, mapearDetalhe } from "@/lib/adapters/2embed";

async function buscarItem(
  categoria: CategoriaConteudo,
  id: string
): Promise<EmbedItem | null> {
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
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = (await res.json()) as EmbedItem;
      if (data && (data.tmdb_id || data.imdb_id || data.name || data.title)) return data;
    } catch {
      /* next */
    }
  }
  return null;
}

export function PlayerLoader({
  categoria: catRaw,
  id: idRaw,
}: {
  categoria: string;
  id: string;
}) {
  const [conteudo, setConteudo] = useState<ConteudoDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const categoria = categoriaRotaSegura(catRaw);
    const idLimpo = idConteudoSeguro(idRaw);
    if (!categoria || !idLimpo) {
      setErro("Link invalido");
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const item = await buscarItem(categoria, idLimpo);
        if (!item) throw new Error("Titulo nao encontrado");
        const detalhe = mapearDetalhe(item, categoria);
        if (!cancel) setConteudo(detalhe);
      } catch (e) {
        if (!cancel) setErro(e instanceof Error ? e.message : "Falha");
      }
    })();
    return () => {
      cancel = true;
    };
  }, [catRaw, idRaw]);

  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-center text-white">
        <div>
          <p className="mb-2">Nao foi possivel abrir o player</p>
          <p className="text-sm text-white/50">{erro}</p>
          <a href="/" className="mt-4 inline-block text-sm text-novlyx-accent underline">
            Voltar
          </a>
        </div>
      </div>
    );
  }

  if (!conteudo) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/40">Carregando...</div>;
  }

  return <PlayerPageClient conteudo={conteudo} />;
}
