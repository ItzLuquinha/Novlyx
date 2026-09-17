"use client";

import { useEffect, useState } from "react";
import { ConteudoDetalhado, CategoriaConteudo } from "@/types";
import { ConteudoDetalheClient } from "@/components/features/conteudo-detalhe-client";
import { Skeleton } from "@/components/ui/skeleton";
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
      if (data && (data.tmdb_id || data.imdb_id || data.name || data.title)) {
        return data;
      }
    } catch {
      /* tenta proxima */
    }
  }
  return null;
}

export function ConteudoDetalheLoader({
  categoria: catRaw,
  id: idRaw,
}: {
  categoria: string;
  id: string;
}) {
  const [conteudo, setConteudo] = useState<ConteudoDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const categoria = categoriaRotaSegura(catRaw);
    const idLimpo = idConteudoSeguro(idRaw);
    if (!categoria || !idLimpo) {
      setErro("Link invalido");
      setCarregando(false);
      return;
    }

    let cancel = false;
    setCarregando(true);
    setErro(null);

    (async () => {
      try {
        const item = await buscarItem(categoria, idLimpo);
        if (!item) throw new Error("Titulo nao encontrado na API");
        const detalhe = mapearDetalhe(item, categoria);
        if (!cancel) setConteudo(detalhe);
      } catch (e) {
        if (!cancel) {
          setErro(e instanceof Error ? e.message : "Falha ao carregar");
          setConteudo(null);
        }
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [catRaw, idRaw]);

  if (carregando) {
    return (
      <div className="container space-y-6 py-10">
        <Skeleton className="h-[40vh] w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (erro || !conteudo) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-lg font-medium text-novlyx-white">
          Nao foi possivel abrir este titulo
        </p>
        <p className="max-w-md text-sm text-novlyx-gray-light">
          {erro || "Conteudo indisponivel no momento."}
        </p>
        <a href="/" className="text-sm text-novlyx-accent underline">
          Voltar ao inicio
        </a>
      </div>
    );
  }

  return <ConteudoDetalheClient conteudo={conteudo} />;
}
