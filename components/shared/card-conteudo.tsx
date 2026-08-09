"use client";

import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import Link from "next/link";
import { motion } from "framer-motion";
import { Info, Play, Plus, Check, Star } from "lucide-react";
import { ConteudoResumo } from "@/types";
import { Badge } from "@/components/ui/badge";
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
      whileHover={{ scale: 1.06, zIndex: 10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative w-[160px] shrink-0 sm:w-[190px]"
    >
      <Link href={`/conteudo/${conteudo.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-novlyx-graphite-light shadow-lg shadow-black/40">
          <Image
            src={conteudo.posterUrl}
            alt={conteudo.titulo}
            fill
            sizes="(max-width: 640px) 160px, 190px"
            priority={prioridade}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 flex flex-col gap-1">
            <Badge
              variant={conteudo.qualidade === "Cinema" ? "outline" : "gold"}
              className={
                conteudo.qualidade === "Cinema"
                  ? "border-amber-500/60 bg-amber-600/20 text-amber-200 backdrop-blur-sm"
                  : "backdrop-blur-sm"
              }
            >
              {conteudo.qualidade}
            </Badge>
            {conteudo.emCinema && (
              <Badge className="bg-amber-600/90 text-[10px] text-white border-0">
                Cinema
              </Badge>
            )}
            {conteudo.idiomaOriginal?.startsWith("pt") && (
              <Badge className="bg-emerald-600/90 text-[10px] text-white border-0">
                PT
              </Badge>
            )}
          </div>

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="mb-2 flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Assistir"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-novlyx-white text-novlyx-black transition-transform hover:scale-110"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={aoAlternarLista}
                aria-label={presente ? "Remover da lista" : "Adicionar a lista"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-transform hover:scale-110",
                  presente
                    ? "border-novlyx-gold bg-novlyx-gold/20 text-novlyx-gold"
                    : "border-white/40 bg-black/40 text-novlyx-white"
                )}
              >
                {presente ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                aria-label="Mais informacoes"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/40 text-novlyx-white transition-transform hover:scale-110"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="truncate text-sm font-semibold text-novlyx-white">
              {conteudo.titulo}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-novlyx-gray-light">
              <span className="flex items-center gap-0.5 text-novlyx-gold">
                <Star className="h-3 w-3 fill-current" />
                {formatarNota(conteudo.nota)}
              </span>
              <span>{conteudo.ano}</span>
            </div>
          </div>
        </div>

        <p className="mt-2 truncate text-sm font-medium text-novlyx-white group-hover:text-novlyx-gold sm:hidden">
          {conteudo.titulo}
        </p>
      </Link>
    </motion.div>
  );
}
