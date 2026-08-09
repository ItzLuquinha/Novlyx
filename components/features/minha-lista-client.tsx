"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useMinhaLista } from "@/hooks/use-minha-lista";
import { getProgressoConteudo } from "@/services/continuar-assistindo.service";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatarTimestamp,
  percentualProgresso,
  rotuloContinuar,
} from "@/utils/tempo-assistido";
import { useEffect, useState } from "react";
import { ProgressoContinuarAssistindo } from "@/types";
import { EVENTO_PROGRESSO } from "@/services/continuar-assistindo.service";

export function MinhaListaClient() {
  const { itens, carregado } = useMinhaLista();
  const [progressos, setProgressos] = useState<
    Record<string, ProgressoContinuarAssistindo | null>
  >({});

  useEffect(() => {
    function carregar() {
      const map: Record<string, ProgressoContinuarAssistindo | null> = {};
      for (const item of itens) {
        map[item.conteudoId] = getProgressoConteudo(item.conteudoId);
      }
      setProgressos(map);
    }
    carregar();
    window.addEventListener(EVENTO_PROGRESSO, carregar);
    return () => window.removeEventListener(EVENTO_PROGRESSO, carregar);
  }, [itens]);

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="mb-2 text-2xl font-bold text-novlyx-white sm:text-3xl">
        Minha Lista
      </h1>
      <p className="mb-8 text-novlyx-gray-light">
        Os conteúdos que você salvou. Se já começou a assistir, mostramos onde
        parou.
      </p>

      {!carregado && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
          ))}
        </div>
      )}

      {carregado && itens.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Bookmark className="h-10 w-10 text-novlyx-gray-light" />
          <p className="text-lg font-medium text-novlyx-white">
            Sua lista está vazia
          </p>
          <p className="max-w-sm text-sm text-novlyx-gray-light">
            Adicione filmes, séries, animes e doramas para assistir mais tarde.
          </p>
        </div>
      )}

      {carregado && itens.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {itens.map((item) => {
            const prog = progressos[item.conteudoId];
            const pct = prog
              ? percentualProgresso(
                  prog.tempoAtualSegundos,
                  prog.duracaoTotalSegundos
                )
              : 0;

            return (
              <Link
                key={item.conteudoId}
                href={
                  prog && prog.tempoAtualSegundos >= 15
                    ? `/player/${item.conteudoId}`
                    : `/conteudo/${item.conteudoId}`
                }
                className="group"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-novlyx-graphite-light">
                  <Image
                    src={item.posterUrl}
                    alt={item.titulo}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {prog && prog.tempoAtualSegundos >= 15 && (
                    <>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-8">
                        <p className="text-[10px] font-medium text-novlyx-gold">
                          {rotuloContinuar(prog)}
                        </p>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                        <div
                          className="h-full bg-novlyx-gold"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="absolute right-1.5 top-1.5 rounded bg-black/75 px-1 py-0.5 text-[10px] tabular-nums text-white">
                        {formatarTimestamp(prog.tempoAtualSegundos)}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-medium text-novlyx-white">
                  {item.titulo}
                </p>
                <p className="text-xs text-novlyx-gray-light">{item.ano}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
