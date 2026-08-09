"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { Temporada } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { formatarDuracao } from "@/utils/formatadores";

interface ListaTemporadasProps {
  conteudoId: string;
  temporadas: Temporada[];
}

export function ListaTemporadas({ conteudoId, temporadas }: ListaTemporadasProps) {
  const [temporadaId, setTemporadaId] = useState(temporadas[0]?.id ?? "");
  const temporada = temporadas.find((t) => t.id === temporadaId) ?? temporadas[0];

  if (!temporada) return null;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-novlyx-white">
          Temporadas e Episodios
        </h2>
        <Select value={temporadaId} onValueChange={setTemporadaId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione a temporada" />
          </SelectTrigger>
          <SelectContent>
            {temporadas.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        {temporada.episodios.map((episodio) => (
          <Link
            key={episodio.id}
            href={`/player/${conteudoId}?temporada=${temporada.id}&episodio=${episodio.id}`}
            className="group flex gap-4 rounded-lg border border-white/10 bg-novlyx-graphite p-3 transition-colors hover:border-novlyx-gold/40 hover:bg-novlyx-graphite-light"
          >
            <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-novlyx-graphite-light sm:w-44">
              <Image
                src={episodio.posterUrl}
                alt={episodio.titulo}
                fill
                sizes="176px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-6 w-6 fill-current text-novlyx-white" />
              </div>
              <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-novlyx-white">
                {episodio.numero}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-1">
              <p className="font-medium text-novlyx-white group-hover:text-novlyx-gold">
                {episodio.titulo}
              </p>
              <p className="line-clamp-2 text-sm text-novlyx-gray-light">
                {episodio.descricao}
              </p>
              <span className="flex items-center gap-1 text-xs text-novlyx-gray-light">
                <Clock className="h-3 w-3" />
                {formatarDuracao(episodio.duracaoMinutos)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
