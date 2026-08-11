"use client";

import { useEffect, useState, useCallback } from "react";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConteudoResumo } from "@/types";
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
    <section className="relative h-[48vh] min-h-[340px] w-full overflow-hidden sm:h-[62vh] sm:min-h-[460px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={destaque.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
          className="absolute inset-0"
        >
          <Image
            src={destaque.bannerUrl}
            alt={destaque.titulo}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-banner-side" />
          <div className="absolute inset-0 bg-banner-fade" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-[1] flex h-full items-end pb-12 sm:items-center sm:pb-0">
        <motion.div
          key={`txt-${destaque.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="max-w-xl"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-white/50">
            <span className="font-medium text-novlyx-accent">
              {formatarNota(destaque.nota)}
            </span>
            <span>{destaque.ano}</span>
            <span className="rounded border border-novlyx-accent/40 px-1.5 py-px text-[11px] font-medium text-novlyx-accent">
              {destaque.qualidade}
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl">
            {destaque.titulo}
          </h1>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href={`/player/${destaque.id}`}
              className="inline-flex h-11 items-center justify-center rounded-md bg-novlyx-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-novlyx-accent-soft"
            >
              Assistir
            </Link>
            <Link
              href={`/conteudo/${destaque.id}`}
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/12 bg-novlyx-graphite-light px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Detalhes
            </Link>
          </div>
        </motion.div>
      </div>

      {itens.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-[1] flex -translate-x-1/2 gap-1.5 sm:bottom-8 sm:left-auto sm:right-8 sm:translate-x-0">
          {itens.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Destaque ${i + 1}`}
              onClick={() => setIndiceAtual(i)}
              className={cn(
                "h-1 rounded-full transition-all",
                i === indiceAtual
                  ? "w-6 bg-novlyx-accent"
                  : "w-2.5 bg-white/25 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
