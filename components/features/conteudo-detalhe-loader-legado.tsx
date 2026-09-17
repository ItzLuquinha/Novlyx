"use client";

import { useEffect, useState } from "react";
import { ConteudoDetalhado } from "@/types";
import { ConteudoDetalheClient } from "@/components/features/conteudo-detalhe-client";
import { Skeleton } from "@/components/ui/skeleton";
import { idConteudoSeguro } from "@/lib/url-segura";
import { ehCategoriaValida, parseIdInterno } from "@/lib/identidade";

export function ConteudoDetalheLoaderLegado({ id: idRaw }: { id: string }) {
  const [conteudo, setConteudo] = useState<ConteudoDetalhado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const idLimpo = idConteudoSeguro(idRaw);
    if (!idLimpo) {
      setErro("Link invalido");
      setCarregando(false);
      return;
    }

    let cancel = false;
    setCarregando(true);

    (async () => {
      try {
        const parsed = parseIdInterno(idLimpo);
        let categoria = parsed?.categoria;
        let idBusca = idLimpo;

        if (parsed?.tmdbId) idBusca = parsed.tmdbId;
        else if (parsed?.imdbId) idBusca = parsed.imdbId;

        if (!categoria || !ehCategoriaValida(categoria)) {
          // tenta serie primeiro (animes/doramas usam endpoint de TV)
          for (const cat of ["serie", "filme", "anime", "dorama"] as const) {
            const res = await fetch(
              `/api/conteudo/${cat}/${encodeURIComponent(idBusca)}`,
              { cache: "no-store" }
            );
            if (res.ok) {
              const data = (await res.json()) as ConteudoDetalhado;
              if (!cancel) setConteudo(data);
              return;
            }
          }
          throw new Error("Conteudo nao encontrado");
        }

        const res = await fetch(
          `/api/conteudo/${categoria}/${encodeURIComponent(idBusca)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.erro || `Erro ${res.status}`);
        }
        const data = (await res.json()) as ConteudoDetalhado;
        if (!cancel) setConteudo(data);
      } catch (e) {
        if (!cancel) {
          setErro(e instanceof Error ? e.message : "Falha ao carregar");
        }
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [idRaw]);

  if (carregando) {
    return (
      <div className="container space-y-6 py-10">
        <Skeleton className="h-[40vh] w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
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
          {erro || "Conteudo indisponivel."}
        </p>
        <a href="/" className="text-sm text-novlyx-accent underline">
          Voltar ao inicio
        </a>
      </div>
    );
  }

  return <ConteudoDetalheClient conteudo={conteudo} />;
}
