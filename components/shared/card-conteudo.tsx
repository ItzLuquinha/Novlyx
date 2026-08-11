"use client";

import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play, Plus, Check, Star } from "lucide-react";
import { ConteudoResumo } from "@/types";
import { formatarNota } from "@/utils/formatadores";
import { useEstaNaMinhaLista, useMinhaLista } from "@/hooks/use-minha-lista";
import { cn } from "@/lib/utils";

interface CardConteudoProps {
  conteudo: ConteudoResumo;
  prioridade?: boolean;
}

export function CardConteudo({ conteudo, prioridade = false }: CardConteudoProps) {
  const { presente, atualizar } = useEstaNaMinhaLista(conteudo.id);
  const { alternar } = useMinhaLista();

  function aoAlternarLista(evento: React.MouseEvent) {
    evento.preventDefault();
    evento.stopPropagation();
    alternar({
      conteudoId: conteudo.id,
      categoria: conteudo.categoria,
      titulo: conteudo.titulo,
      posterUrl: conteudo.posterUrl,
      ano: conteudo.ano,
      nota: conteudo.nota,
    });
    atualizar();
  }

  return (
    <motion.div
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative w-[150px] shrink-0 sm:w-[180px]"
    >
      <Link href={`/conteudo/${conteudo.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-novlyx-graphite-light">
          <Image
            src={conteudo.posterUrl}
            alt={conteudo.titulo}
            fill
            sizes="(max-width: 640px) 150px, 180px"
            priority={prioridade}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <span className="rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
              {conteudo.qualidade}
            </span>
            {conteudo.idiomaOriginal?.startsWith("pt") && (
              <span className="rounded-sm bg-novlyx-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
                PT
              </span>
            )}
          </div>

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-novlyx-black">
                <Play className="h-3.5 w-3.5 fill-current" />
              </span>
              <button
                type="button"
                onClick={aoAlternarLista}
                aria-label={presente ? "Remover da lista" : "Adicionar a lista"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md border",
                  presente
                    ? "border-novlyx-accent/50 bg-novlyx-accent/20 text-novlyx-accent"
                    : "border-white/20 bg-black/50 text-white"
                )}
              >
                {presente ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-black/50 text-white">
                <Info className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="truncate text-sm font-medium text-white">
              {conteudo.titulo}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/50">
              <span className="inline-flex items-center gap-0.5 text-novlyx-accent">
                <Star className="h-3 w-3 fill-current" />
                {formatarNota(conteudo.nota)}
              </span>
              <span>{conteudo.ano}</span>
            </div>
          </div>
        </div>

        <p className="mt-2 truncate text-sm text-white/80 sm:hidden">
          {conteudo.titulo}
        </p>
      </Link>
    </motion.div>
  );
}
