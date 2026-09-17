"use client";

import { useEffect, useState } from "react";
import { ConteudoDetalhado } from "@/types";
import { PlayerPageClient } from "@/components/features/player/player-page-client";
import { categoriaRotaSegura, idConteudoSeguro } from "@/lib/url-segura";

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
        </div>
      </div>
    );
  }

  if (!conteudo) {
    return <div className="aspect-video w-full bg-black" />;
  }

  return <PlayerPageClient conteudo={conteudo} />;
}
