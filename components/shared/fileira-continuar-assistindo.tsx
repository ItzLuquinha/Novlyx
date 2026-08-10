"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { useContinuarAssistindo } from "@/hooks/use-continuar-assistindo";
import { Button } from "@/components/ui/button";
import {
  formatarTimestamp,
  percentualProgresso,
  rotuloContinuar,
} from "@/utils/tempo-assistido";

export function FileiraContinuarAssistindo() {
  const { itens, carregado, limpar } = useContinuarAssistindo();
  const [confirmar, setConfirmar] = useState(false);

  if (!carregado || itens.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-novlyx-white sm:text-xl">
          Continuar assistindo
        </h2>
        {!confirmar ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setConfirmar(true)}
            className="min-h-11 min-w-[7rem] gap-1.5 px-4 text-sm text-white/55 hover:bg-white/10 hover:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
            Limpar
          </Button>
        ) : (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <span className="text-xs text-white/50">Apagar tudo?</span>
            <Button
              type="button"
              size="sm"
              className="min-h-11 bg-rose-600 text-white hover:bg-rose-500"
              onClick={() => {
                limpar();
                setConfirmar(false);
              }}
            >
              Sim, apagar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-11 text-white/60"
              onClick={() => setConfirmar(false)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {itens.map((item) => {
          const percentual = percentualProgresso(
            item.tempoAtualSegundos,
            item.duracaoTotalSegundos
          );

          return (
            <Link
              key={item.conteudoId}
              href={`/player/${item.conteudoId}`}
              className="group w-[160px] shrink-0 sm:w-[200px]"
            >
              <div className="relative aspect-video overflow-hidden rounded-md bg-novlyx-graphite-light">
                <Image
                  src={item.posterUrl}
                  alt={item.titulo}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <span className="absolute bottom-3 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium tabular-nums text-white">
                  {formatarTimestamp(item.tempoAtualSegundos)}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-novlyx-gold"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-white/80 sm:text-sm">
                {item.titulo}
              </p>
              <p className="text-[10px] text-white/40">{rotuloContinuar(item)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
