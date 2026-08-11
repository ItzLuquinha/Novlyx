"use client";

import { useState, useMemo } from "react";
import { Heart, Radio, Search, Star } from "lucide-react";
import { useCanais, useCategoriasCanais } from "@/hooks/use-canais";
import { useCanaisFavoritos } from "@/hooks/use-canais-favoritos";
import { CardCanal } from "@/components/shared/card-canal";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlayerHls } from "@/components/features/player-hls";
import { cn } from "@/lib/utils";
import { Canal } from "@/types";

export function TvAoVivoClient() {
  const { data: canais, isLoading } = useCanais();
  const { data: categorias } = useCategoriasCanais();
  const { ids: favIds, alternar, isFavorito } = useCanaisFavoritos();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(
    null
  );
  const [busca, setBusca] = useState("");
  const [canalAtivo, setCanalAtivo] = useState<Canal | null>(null);
  const [soFavoritos, setSoFavoritos] = useState(false);

  const canaisFiltrados = useMemo(() => {
    if (!canais) return [];
    return canais.filter((canal) => {
      if (soFavoritos && !favIds.includes(canal.id)) return false;
      const correspondeCategoria =
        !categoriaSelecionada || canal.categoriaId === categoriaSelecionada;
      const correspondeBusca = canal.nome
        .toLowerCase()
        .includes(busca.toLowerCase());
      return correspondeCategoria && correspondeBusca;
    });
  }, [canais, categoriaSelecionada, busca, soFavoritos, favIds]);

  const favoritosLista = useMemo(() => {
    if (!canais) return [];
    return favIds
      .map((id) => canais.find((c) => c.id === id))
      .filter(Boolean) as Canal[];
  }, [canais, favIds]);

  const canalExibido = canalAtivo ?? canaisFiltrados[0] ?? null;

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="mb-2 text-2xl font-bold text-novlyx-white sm:text-3xl">
        TV ao Vivo
      </h1>
      <p className="mb-6 text-sm text-novlyx-gray-light">
        Streams gratuitos (fonte{" "}
        <a
          href="https://github.com/Free-TV/IPTV"
          target="_blank"
          rel="noopener noreferrer"
          className="text-novlyx-accent/80 hover:underline"
        >
          Free-TV/IPTV
        </a>
        ). Só canais free-to-air / públicos - alguns podem ficar offline.
      </p>

      {canalExibido && (
        <div className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-black">
          <div className="relative aspect-video w-full">
            {canalExibido.streamUrl ? (
              <PlayerHls
                key={canalExibido.streamUrl}
                src={canalExibido.streamUrl}
                titulo={canalExibido.nome}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 bg-black text-white/50">
                <Radio className="h-8 w-8" />
                <p className="text-sm">Sem stream disponível para este canal</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <div>
              <p className="font-medium text-white">{canalExibido.nome}</p>
              <p className="text-xs text-white/45">{canalExibido.categoriaNome}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-white/20 text-white hover:bg-white/10"
              onClick={() => alternar(canalExibido.id)}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isFavorito(canalExibido.id) && "fill-rose-500 text-rose-500"
                )}
              />
              {isFavorito(canalExibido.id) ? "Favorito" : "Favoritar"}
            </Button>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar canal..."
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          variant={soFavoritos ? "default" : "outline"}
          size="sm"
          className={cn(
            "gap-1.5",
            soFavoritos
              ? "bg-novlyx-accent text-black hover:bg-novlyx-accent/90"
              : "border-white/15 text-white"
          )}
          onClick={() => setSoFavoritos((v) => !v)}
        >
          <Star className={cn("h-3.5 w-3.5", soFavoritos && "fill-current")} />
          Favoritos ({favIds.length})
        </Button>
      </div>

      {favoritosLista.length > 0 && !soFavoritos && (
        <div className="mb-6">
          <p className="mb-3 text-xs uppercase tracking-wider text-white/40">
            Seus favoritos
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favoritosLista.map((canal) => (
              <div key={canal.id} className="w-[140px] shrink-0">
                <CardCanal
                  canal={canal}
                  ativo={canalExibido?.id === canal.id}
                  onSelecionar={setCanalAtivo}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoriaSelecionada(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs transition-colors",
            !categoriaSelecionada
              ? "bg-novlyx-accent text-black"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          )}
        >
          Todos
        </button>
        {(categorias ?? []).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoriaSelecionada(cat.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs transition-colors",
              categoriaSelecionada === cat.id
                ? "bg-novlyx-accent text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            )}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && canaisFiltrados.length === 0 && (
        <p className="py-16 text-center text-sm text-white/45">
          Nenhum canal encontrado.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {canaisFiltrados.map((canal) => (
          <div key={canal.id} className="relative">
            <CardCanal
              canal={canal}
              ativo={canalExibido?.id === canal.id}
              onSelecionar={setCanalAtivo}
            />
            <button
              type="button"
              aria-label="Favoritar"
              onClick={(e) => {
                e.stopPropagation();
                alternar(canal.id);
              }}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white  hover:bg-black/80"
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  isFavorito(canal.id) && "fill-rose-500 text-rose-500"
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
