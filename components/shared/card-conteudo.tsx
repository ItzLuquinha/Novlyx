"use client";

import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import Link from "next/link";
import { ConteudoResumo } from "@/types";
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
    <div className="group relative w-[140px] shrink-0 sm:w-[168px]">
      <Link href={`/conteudo/${conteudo.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-novlyx-graphite-light">
          <Image
            src={conteudo.posterUrl}
            alt={conteudo.titulo}
            fill
            sizes="(max-width: 640px) 140px, 168px"
            priority={prioridade}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />

          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {conteudo.qualidade && (
              <span className="rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
                {conteudo.qualidade}
              </span>
            )}
            {conteudo.idiomaOriginal?.startsWith("pt") && (
              <span className="rounded bg-novlyx-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
                PT
              </span>
            )}
          </div>

          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={aoAlternarLista}
              className={cn(
                "rounded px-2 py-1 text-[10px] font-medium",
                presente
                  ? "bg-novlyx-accent text-white"
                  : "bg-white/15 text-white"
              )}
            >
              {presente ? "Na lista" : "Minha lista"}
            </button>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-white/80 group-hover:text-white">
          {conteudo.titulo}
        </p>
      </Link>
    </div>
  );
}
