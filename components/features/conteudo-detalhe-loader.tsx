"use client";

import { useEffect, useState } from "react";
import { ConteudoDetalhado } from "@/types";
import { ConteudoDetalheClient } from "@/components/features/conteudo-detalhe-client";
import { Skeleton } from "@/components/ui/skeleton";
import { categoriaRotaSegura, idConteudoSeguro } from "@/lib/url-segura";

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
        const res = await fetch(
          `/api/conteudo/${encodeURIComponent(categoria)}/${encodeURIComponent(idLimpo)}`,
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
        <Skeleton className="h-8 w-2/3" />
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
          {erro || "Conteudo indisponivel no momento. Tente outro ou volte mais tarde."}
        </p>
        <a href="/" className="text-sm text-novlyx-accent underline">
          Voltar ao inicio
        </a>
      </div>
    );
  }

  return <ConteudoDetalheClient conteudo={conteudo} />;
}
