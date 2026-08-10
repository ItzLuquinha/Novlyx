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
  const [confirmar, setConfirmar] = useState(false);

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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Histórico</h1>
          <p className="mt-1 text-sm text-white/50">
            Títulos que você abriu no player neste dispositivo.
          </p>
        </div>
        {itens.length > 0 && !confirmar && (
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 w-full gap-1.5 text-white/55 hover:bg-white/10 hover:text-rose-300 sm:w-auto"
            onClick={() => setConfirmar(true)}
          >
            <Trash2 className="h-4 w-4" />
            Limpar histórico
          </Button>
        )}
        {itens.length > 0 && confirmar && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <p className="text-sm text-white/50">Apagar todo o histórico?</p>
            <div className="flex gap-2">
              <Button
                type="button"
                className="min-h-11 flex-1 bg-rose-600 text-white hover:bg-rose-500 sm:flex-none"
                onClick={() => {
                  limparHistorico();
                  setItens([]);
                  setConfirmar(false);
                }}
              >
                Sim, apagar
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 flex-1 text-white/60 sm:flex-none"
                onClick={() => setConfirmar(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
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
