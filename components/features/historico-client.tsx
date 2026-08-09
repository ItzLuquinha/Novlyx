"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { History, Trash2 } from "lucide-react";
import {
  EVENTO_HISTORICO,
  getHistorico,
  limparHistorico,
  ItemHistorico,
} from "@/services/historico.service";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { Button } from "@/components/ui/button";
import { formatarTimestamp } from "@/utils/tempo-assistido";

export function HistoricoClient() {
  const [itens, setItens] = useState<ItemHistorico[]>([]);
  const [carregado, setCarregado] = useState(false);

  const recarregar = useCallback(() => {
    setItens(getHistorico());
    setCarregado(true);
  }, []);

  useEffect(() => {
    recarregar();
    window.addEventListener(EVENTO_HISTORICO, recarregar);
    return () => window.removeEventListener(EVENTO_HISTORICO, recarregar);
  }, [recarregar]);

  return (
    <div className="container py-10 sm:py-14">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Histórico</h1>
          <p className="mt-1 text-sm text-white/50">
            Títulos que você abriu no player neste dispositivo.
          </p>
        </div>
        {itens.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-white/40 hover:text-rose-300"
            onClick={() => {
              if (confirm("Apagar todo o histórico?")) {
                limparHistorico();
                recarregar();
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {carregado && itens.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <History className="h-10 w-10 text-white/30" />
          <p className="text-white/70">Nada por aqui ainda</p>
          <p className="max-w-xs text-sm text-white/40">
            Assista algo por alguns segundos e o título aparece nesta lista.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {itens.map((item) => (
          <Link
            key={`${item.conteudoId}-${item.assistidoEm}`}
            href={`/player/${item.conteudoId}`}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
          >
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-novlyx-graphite">
              <Image
                src={item.posterUrl}
                alt={item.titulo}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {item.titulo}
              </p>
              <p className="text-xs text-white/40">
                {item.temporadaNumero
                  ? `T${item.temporadaNumero} E${item.episodioNumero ?? 1} · `
                  : ""}
                {formatarTimestamp(item.tempoAtualSegundos)}
                {" · "}
                {new Date(item.assistidoEm).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
