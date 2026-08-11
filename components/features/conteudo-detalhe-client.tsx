"use client";

import Link from "next/link";
import { Play, Plus, Check, Star, Clock, Calendar } from "lucide-react";
import { ConteudoDetalhado } from "@/types";
import { Button } from "@/components/ui/button";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { ListaGeneros } from "@/components/shared/lista-generos";
import { ListaTemporadas } from "@/components/features/lista-temporadas";
import { FileiraConteudo } from "@/components/shared/fileira-conteudo";
import { useEstaNaMinhaLista, useMinhaLista } from "@/hooks/use-minha-lista";
import { useProgressoConteudo } from "@/hooks/use-continuar-assistindo";
import { rotuloContinuar, formatarTimestamp } from "@/utils/tempo-assistido";
import { formatarDuracao, formatarNota } from "@/utils/formatadores";
import { BotaoCompartilhar } from "@/components/shared/botao-compartilhar";
import { BotaoTrailer } from "@/components/features/trailer-modal";
import { BotaoWatchParty } from "@/components/features/watch-party";

export function ConteudoDetalheClient({
  conteudo,
}: {
  conteudo: ConteudoDetalhado;
}) {
  const { presente, atualizar } = useEstaNaMinhaLista(conteudo.id);
  const { progresso } = useProgressoConteudo(conteudo.id);
  const { alternar } = useMinhaLista();

  function aoAlternarLista() {
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
    <>
      <section className="relative h-[50vh] min-h-[380px] w-full overflow-hidden sm:h-[62vh]">
        <Image
          src={conteudo.bannerUrl}
          alt={conteudo.titulo}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-banner-side" />
        <div className="absolute inset-0 bg-banner-fade" />
      </section>

      <div className="container relative z-10 -mt-32 pb-20 sm:-mt-48">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="relative mx-auto aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-2xl sm:w-64 lg:mx-0">
            <Image
              src={conteudo.posterUrl}
              alt={conteudo.titulo}
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-novlyx-white sm:text-4xl">
              {conteudo.titulo}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-novlyx-gray-light">
              <span className="flex items-center gap-1 font-semibold text-novlyx-accent">
                <Star className="h-4 w-4 fill-current" />
                {formatarNota(conteudo.nota)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {conteudo.ano}
              </span>
              {conteudo.duracaoMinutos && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatarDuracao(conteudo.duracaoMinutos)}
                </span>
              )}
              <span className="rounded border border-novlyx-accent/40 px-1.5 py-0.5 text-xs text-novlyx-accent">
                {conteudo.qualidade}
              </span>
              <span className="rounded border border-white/20 px-1.5 py-0.5 text-xs">
                {conteudo.classificacaoIndicativa}
              </span>
            </div>

            <div className="mt-4">
              {(conteudo.emCinema || conteudo.idiomaOriginal) && (
              <div className="mb-3 flex flex-wrap gap-2 text-sm">
                {conteudo.emCinema && (
                  <span className="rounded-full bg-amber-600/20 px-3 py-1 text-amber-400 border border-amber-600/30">
                    Em cinema / lançamento recente
                  </span>
                )}
                {conteudo.idiomaOriginal && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-white/70 border border-white/10">
                    Idioma original: {conteudo.idiomaOriginal?.startsWith("pt") ? "Português" : conteudo.idiomaOriginal?.toUpperCase()}
                  </span>
                )}
                <span className="rounded-full bg-white/5 px-3 py-1 text-white/50 border border-white/10 text-xs">
                  Áudio/legenda PT depende da fonte no player
                </span>
              </div>
            )}
            <ListaGeneros generos={conteudo.generos} />
            </div>

            <p className="mt-5 max-w-3xl leading-relaxed text-novlyx-white/90">
              {conteudo.descricao}
            </p>

            <div className="mt-5 grid gap-1.5 text-sm text-novlyx-gray-light">
              {conteudo.diretor && (
                <p>
                  <span className="text-novlyx-white">Direcao: </span>
                  {conteudo.diretor}
                </p>
              )}
              <p>
                <span className="text-novlyx-white">Elenco: </span>
                {conteudo.elenco.join(", ")}
              </p>
              <p>
                <span className="text-novlyx-white">Pais de origem: </span>
                {conteudo.paisOrigem}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild>
                <Link href={`/player/${conteudo.id}`}>
                  <Play className="h-5 w-5 fill-current" />
                  {progresso && progresso.tempoAtualSegundos >= 15
                    ? `Continuar · ${formatarTimestamp(progresso.tempoAtualSegundos)}`
                    : "Assistir"}
                </Link>
              </Button>
              {progresso && progresso.tempoAtualSegundos >= 15 && (
                <p className="w-full text-xs text-novlyx-accent/80">
                  {rotuloContinuar(progresso)}
                </p>
              )}
              <Button variant="secondary" size="lg" onClick={aoAlternarLista}>
                {presente ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {presente ? "Na Minha Lista" : "Minha Lista"}
              </Button>
              <BotaoTrailer trailerUrl={conteudo.trailerUrl} />
              <BotaoCompartilhar titulo={conteudo.titulo} />
            </div>
          </div>
        </div>

        {conteudo.temporadas && conteudo.temporadas.length > 0 && (
          <div className="mt-14">
            <ListaTemporadas
              conteudoId={conteudo.id}
              temporadas={conteudo.temporadas}
            />
          </div>
        )}

        <div className="mt-10 max-w-md">
          <BotaoWatchParty
            conteudoId={conteudo.id}
            titulo={conteudo.titulo}
            ehSerie={
              conteudo.categoria === "serie" ||
              conteudo.categoria === "anime" ||
              conteudo.categoria === "dorama"
            }
          />
        </div>

        {conteudo.semelhantes.length > 0 && (
          <div className="mt-14">
            <FileiraConteudo titulo="Conteudos Semelhantes" itens={conteudo.semelhantes} />
          </div>
        )}
      </div>
    </>
  );
}
