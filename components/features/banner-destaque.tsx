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

const INTERVALO_MS = 8000;

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
    <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden sm:h-[68vh] sm:min-h-[480px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={destaque.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
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

      <div className="container relative flex h-full items-end pb-14 sm:items-center sm:pb-0">
        <motion.div
          key={`conteudo-${destaque.id}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="max-w-2xl"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2.5 text-sm text-white/55">
            <span className="inline-flex items-center gap-1 font-medium text-novlyx-accent">
              <Star className="h-3.5 w-3.5 fill-current" />
              {formatarNota(destaque.nota)}
            </span>
            <span>{destaque.ano}</span>
            <span className="rounded-sm border border-novlyx-accent/35 px-1.5 py-0.5 text-[11px] font-medium text-novlyx-accent">
              {destaque.qualidade}
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {destaque.titulo}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Button variant="accent" size="lg" asChild>
              <Link href={`/player/${destaque.id}`}>
                <Play className="h-4 w-4 fill-current" />
                Assistir
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href={`/conteudo/${destaque.id}`}>
                <Info className="h-4 w-4" />
                Detalhes
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {itens.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-10 sm:left-auto sm:right-8 sm:translate-x-0">
          {itens.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Destaque ${i + 1}`}
              onClick={() => setIndiceAtual(i)}
              className={cn(
                "h-1 rounded-sm transition-all duration-300",
                i === indiceAtual
                  ? "w-7 bg-novlyx-accent"
                  : "w-3 bg-white/25 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
