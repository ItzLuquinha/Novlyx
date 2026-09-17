"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { CategoriaConteudo, Temporada } from "@/types";
import { hrefPlayer } from "@/lib/identidade";
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
  categoria: CategoriaConteudo;
  tmdbId?: string;
  imdbId?: string;
  temporadas: Temporada[];
}

const LIMITE_UI = 60;

function episodiosDaTemporada(temporada: Temporada) {
  if (temporada.episodios?.length) return temporada.episodios;
  const total = Math.min(LIMITE_UI, Math.max(0, temporada.totalEpisodios || 0));
  if (total <= 0) return [];
  return Array.from({ length: total }, (_, i) => {
    const ep = i + 1;
    return {
      id: String(ep),
      numero: ep,
      temporadaId: temporada.id,
      titulo: `Episodio ${ep}`,
      descricao: "",
      duracaoMinutos: 0,
      posterUrl: temporada.posterUrl || "",
      dataLancamento: "",
    };
  });
}

export function ListaTemporadas({
  conteudoId,
  categoria,
  tmdbId,
  imdbId,
  temporadas,
}: ListaTemporadasProps) {
  const validas = useMemo(
    () => (temporadas || []).filter((t) => t && t.id != null),
    [temporadas]
  );
  const [temporadaId, setTemporadaId] = useState(validas[0]?.id ?? "");
  const temporada =
    validas.find((t) => t.id === temporadaId) ?? validas[0] ?? null;

  const episodios = useMemo(
    () => (temporada ? episodiosDaTemporada(temporada) : []),
    [temporada]
  );

  if (!temporada || validas.length === 0) return null;

  const totalReal = temporada.totalEpisodios || episodios.length;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-novlyx-white">
          Temporadas e Episodios
        </h2>
        <Select value={temporada.id} onValueChange={setTemporadaId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione a temporada" />
          </SelectTrigger>
          <SelectContent>
            {validas.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {episodios.length === 0 ? (
        <p className="text-sm text-novlyx-gray-light">
          Episodios ainda nao listados. Abra o player e escolha a temporada la.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {episodios.map((episodio) => (
            <Link
              key={episodio.id}
              href={hrefPlayer(
                {
                  categoria,
                  tmdbId,
                  imdbId,
                  idInterno: conteudoId,
                  id: conteudoId,
                },
                temporada.numero,
                episodio.numero
              )}
              className="group flex gap-4 rounded-lg border border-white/10 bg-novlyx-graphite p-3 transition-colors hover:border-novlyx-accent/40 hover:bg-novlyx-graphite-light"
            >
              <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-novlyx-graphite-light sm:w-44">
                <Image
                  src={episodio.posterUrl || temporada.posterUrl || ""}
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
                <p className="font-medium text-novlyx-white group-hover:text-novlyx-accent">
                  {episodio.titulo}
                </p>
                {episodio.descricao ? (
                  <p className="line-clamp-2 text-sm text-novlyx-gray-light">
                    {episodio.descricao}
                  </p>
                ) : null}
                {episodio.duracaoMinutos ? (
                  <span className="flex items-center gap-1 text-xs text-novlyx-gray-light">
                    <Clock className="h-3 w-3" />
                    {formatarDuracao(episodio.duracaoMinutos)}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
          {totalReal > episodios.length ? (
            <p className="text-center text-xs text-novlyx-gray-light">
              Mostrando {episodios.length} de {totalReal} episodios. Os demais
              ficam disponiveis no player.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
