"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { ConteudoDetalhado, CategoriaConteudo } from "@/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const ConteudoDetalheClient = dynamic(
  () =>
    import("@/components/features/conteudo-detalhe-client").then(
      (m) => m.ConteudoDetalheClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="container py-16 text-center text-sm text-white/40">
        Montando pagina...
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    const categoria = catOk(categoriaRaw) ? categoriaRaw : "serie";
    const id = decodeURIComponent(idRaw).trim();

    if (!id) {
      setErro("ID ausente na URL");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);

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
        if (!urls.length) throw new Error("Sem ID TMDB/IMDb valido");

        let last = 0;
        for (const url of urls) {
          const res = await fetch(url, { cache: "no-store" });
          last = res.status;
          if (!res.ok) continue;
          const data = await res.json();
          if (data && (data.tmdb_id || data.imdb_id || data.name || data.title)) {
            if (!cancel) setConteudo(mapearDetalhe(data, categoria));
            return;
          }
        }
        throw new Error(`Nao encontrado (HTTP ${last})`);
      } catch (e) {
        if (!cancel) setErro(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [categoriaRaw, idRaw]);

  if (loading) {
    return (
      <div className="container space-y-4 py-16">
        <div className="h-40 animate-pulse rounded-xl bg-white/5" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-white/5" />
        <p className="text-center text-sm text-white/40">
          Carregando {categoriaRaw}/{idRaw}...
        </p>
      </div>
    );
  }

  if (erro || !conteudo) {
    return (
      <div className="container flex min-h-[40vh] flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-lg text-white">Nao foi possivel abrir</p>
        <p className="text-sm text-white/50">{erro}</p>
        <a href="/" className="text-sm text-violet-300 underline">
          Inicio
        </a>
      </div>
    );
  }

  return <ConteudoDetalheClient conteudo={conteudo} />;
}

export default function PaginaTitulo() {
  return (
    <>
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="container py-16 text-center text-sm text-white/40">
              Carregando...
            </div>
          }
        >
          <Corpo />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
