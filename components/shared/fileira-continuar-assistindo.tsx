"use client";

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

  if (!carregado || itens.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-novlyx-white sm:text-xl">
          Continuar assistindo
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (
              window.confirm(
                "Apagar todo o histórico de Continuar Assistindo?"
              )
            ) {
              limpar();
            }
          }}
          className="gap-1.5 text-xs text-white/45 hover:bg-white/5 hover:text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Limpar
        </Button>
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

                {/* Tempo no canto - estilo YouTube */}
                <span className="absolute bottom-3 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium tabular-nums text-white">
                  {formatarTimestamp(item.tempoAtualSegundos)}
                </span>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-novlyx-gold transition-all"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 truncate text-sm font-medium text-novlyx-white">
                {item.titulo}
              </p>
              <p className="truncate text-[11px] text-novlyx-gold/80">
                {rotuloContinuar(item)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
