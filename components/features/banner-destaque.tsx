"use client";

import { useEffect, useState, useCallback } from "react";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star } from "lucide-react";
import { ConteudoResumo } from "@/types";
import { Button } from "@/components/ui/button";
import { formatarNota } from "@/utils/formatadores";
import { cn } from "@/lib/utils";

interface BannerDestaqueProps {
  itens: ConteudoResumo[];
}

const INTERVALO_MS = 7000;

export function BannerDestaque({ itens }: BannerDestaqueProps) {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const proximo = useCallback(() => {
    setIndiceAtual((i) => (i + 1) % itens.length);
  }, [itens.length]);

  useEffect(() => {
    if (itens.length <= 1) return;
    const timer = setInterval(proximo, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [proximo, itens.length]);

  if (itens.length === 0) return null;

  const destaque = itens[indiceAtual]!;

  return (
    <section className="relative h-[58vh] min-h-[400px] w-full overflow-hidden sm:h-[70vh] sm:min-h-[500px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={destaque.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={destaque.bannerUrl}
            alt={destaque.titulo}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-banner-side" />
          <div className="absolute inset-0 bg-banner-fade" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative flex h-full items-end pb-16 sm:items-center sm:pb-0">
        <motion.div
          key={`conteudo-${destaque.id}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-xl"
        >
          <div className="mb-3 flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 font-semibold text-novlyx-gold">
              <Star className="h-4 w-4 fill-current" />
              {formatarNota(destaque.nota)}
            </span>
            <span className="text-novlyx-gray-light">{destaque.ano}</span>
            <span className="rounded border border-novlyx-gold/40 px-1.5 py-0.5 text-xs text-novlyx-gold">
              {destaque.qualidade}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-novlyx-white sm:text-5xl">
            {destaque.titulo}
          </h1>

          <p className="mt-3 line-clamp-3 text-sm text-novlyx-gray-light sm:text-base">
            Uma producao envolvente que mistura tensao, emocao e reviravoltas
            em uma narrativa construida com cuidado do inicio ao fim, com
            elenco de destaque e producao impecavel.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="gold" size="lg" asChild>
              <Link href={`/player/${destaque.id}`}>
                <Play className="h-5 w-5 fill-current" />
                Assistir
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href={`/conteudo/${destaque.id}`}>
                <Info className="h-5 w-5" />
                Mais Informacoes
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {itens.length > 1 && (
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-12 sm:left-auto sm:right-8 sm:translate-x-0">
          {itens.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir para destaque ${i + 1}`}
              onClick={() => setIndiceAtual(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === indiceAtual
                  ? "w-8 bg-novlyx-gold"
                  : "w-4 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
