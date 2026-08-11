"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ConteudoResumo } from "@/types";
import { CardConteudo } from "./card-conteudo";
import { CardConteudoSkeleton } from "./card-conteudo-skeleton";
import { cn } from "@/lib/utils";

interface FileiraConteudoProps {
  titulo: string;
  itens?: ConteudoResumo[];
  carregando?: boolean;
  prioridade?: boolean;
}

export function FileiraConteudo({
  titulo,
  itens,
  carregando = false,
  prioridade = false,
}: FileiraConteudoProps) {
  const trilhaRef = useRef<HTMLDivElement>(null);
  const [podeRolarEsquerda, setPodeRolarEsquerda] = useState(false);
  const [podeRolarDireita, setPodeRolarDireita] = useState(true);

  function atualizarSetas() {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    setPodeRolarEsquerda(trilha.scrollLeft > 8);
    setPodeRolarDireita(
      trilha.scrollLeft < trilha.scrollWidth - trilha.clientWidth - 8
    );
  }

  useEffect(() => {
    atualizarSetas();
  }, [itens]);

  function rolar(direcao: "esquerda" | "direita") {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    const distancia = trilha.clientWidth * 0.85;
    trilha.scrollBy({
      left: direcao === "esquerda" ? -distancia : distancia,
      behavior: "smooth",
    });
  }

  if (!carregando && (!itens || itens.length === 0)) {
    return null;
  }

  return (
    <section className="relative">
      <h2 className="mb-3 px-1 text-base font-semibold text-white/90 sm:text-lg">
        {titulo}
      </h2>

      <div className="group/fileira relative">
        <button
          type="button"
          onClick={() => rolar("esquerda")}
          aria-label="Rolar para a esquerda"
          className={cn(
            "absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-novlyx-black/90 to-transparent text-novlyx-white transition-opacity lg:flex",
            podeRolarEsquerda
              ? "opacity-0 group-hover/fileira:opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div
          ref={trilhaRef}
          onScroll={atualizarSetas}
          className="fileira-scroll scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-1 pb-2"
        >
          {carregando
            ? Array.from({ length: 8 }).map((_, i) => (
                <CardConteudoSkeleton key={i} />
              ))
            : itens?.map((item, i) => (
                <CardConteudo
                  key={item.id}
                  conteudo={item}
                  prioridade={prioridade && i < 4}
                />
              ))}
        </div>

        <button
          type="button"
          onClick={() => rolar("direita")}
          aria-label="Rolar para a direita"
          className={cn(
            "absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-novlyx-black/90 to-transparent text-novlyx-white transition-opacity lg:flex",
            podeRolarDireita
              ? "opacity-0 group-hover/fileira:opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}
