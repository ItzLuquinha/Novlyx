"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, Pause, Play } from "lucide-react";
import { ConteudoDetalhado } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  FONTES_PLAYER,
  logPlayerDebug,
  urlPlayerFilme,
  urlPlayerSerie,
} from "@/lib/player";
import { useProgressoConteudo } from "@/hooks/use-continuar-assistindo";
import { registrarHistorico } from "@/services/historico.service";
import { cn } from "@/lib/utils";
import { urlHttpSegura } from "@/lib/url-segura";
import { formatarTempoPlayer } from "@/utils/formatadores";
import {
  chaveProgresso,
  ehSerieLike,
  hrefConteudo,
} from "@/lib/identidade";

interface PlayerVideoProps {
  conteudo: ConteudoDetalhado;
  season: number;
  episode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

export function PlayerVideo({
  conteudo,
  season,
  episode,
  onSeasonChange,
  onEpisodeChange,
}: PlayerVideoProps) {
  const ehSerie = ehSerieLike(conteudo.categoria);
  const idInterno = conteudo.idInterno || conteudo.id;
  const idsExternos = useMemo(
    () => ({ tmdbId: conteudo.tmdbId, imdbId: conteudo.imdbId }),
    [conteudo.tmdbId, conteudo.imdbId]
  );

  const { progresso, salvar } = useProgressoConteudo(
    idInterno,
    ehSerie ? season : undefined,
    ehSerie ? episode : undefined
  );

  const duracaoEstimada = useMemo(() => {
    if (ehSerie) {
      const ep = conteudo.temporadas
        ?.find((t) => t.numero === season)
        ?.episodios?.find((e) => e.numero === episode);
      if (ep?.duracaoMinutos && ep.duracaoMinutos > 5) {
        return ep.duracaoMinutos * 60;
      }
      return 45 * 60;
    }
    const min = conteudo.duracaoMinutos;
    if (min && min > 20 && min < 400) return min * 60;
    return 120 * 60;
  }, [conteudo.duracaoMinutos, conteudo.temporadas, ehSerie, season, episode]);

  const [fonteId, setFonteId] = useState(FONTES_PLAYER[0]?.id ?? "embedplay");
  const [aceitouAviso, setAceitouAviso] = useState(false);
  const [naoMostrarAviso, setNaoMostrarAviso] = useState(false);
  const [contando, setContando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [restaurado, setRestaurado] = useState(false);

  const tempoRef = useRef(0);
  const contandoRef = useRef(false);
  contandoRef.current = contando;

  function resetarProgressoLocal() {
    tempoRef.current = 0;
    setTempoAtual(0);
    setContando(false);
    contandoRef.current = false;
    setRestaurado(false);
  }

  // Reset total ao trocar de obra
  useEffect(() => {
    resetarProgressoLocal();
    setFonteId(FONTES_PLAYER[0]?.id ?? "embedplay");
  }, [idInterno]);

  useEffect(() => {
    try {
      if (localStorage.getItem("novlyx-aviso-ads-ok") === "1") {
        setAceitouAviso(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Restaura progresso do episódio atual
  useEffect(() => {
    setRestaurado(false);
  }, [idInterno, season, episode]);

  useEffect(() => {
    if (!progresso || restaurado) return;
    if (
      ehSerie &&
      progresso.temporadaNumero != null &&
      progresso.episodioNumero != null &&
      (progresso.temporadaNumero !== season ||
        progresso.episodioNumero !== episode)
    ) {
      return;
    }
    if (progresso.tempoAtualSegundos > 0) {
      const t = Math.min(
        progresso.tempoAtualSegundos,
        Math.max(duracaoEstimada - 30, 0)
      );
      tempoRef.current = t;
      setTempoAtual(t);
    }
    setRestaurado(true);
  }, [
    progresso,
    restaurado,
    season,
    episode,
    ehSerie,
    duracaoEstimada,
  ]);

  const persistir = useCallback(
    (
      tempo: number,
      s: number,
      e: number,
      opts?: { historico?: boolean; forcarHistorico?: boolean }
    ) => {
      const t = Math.max(0, Math.floor(tempo));
      if (t < 5) return;
      const key = chaveProgresso(
        conteudo.categoria,
        idInterno,
        ehSerie ? s : undefined,
        ehSerie ? e : undefined
      );
      salvar({
        progressKey: key,
        conteudoId: idInterno,
        idInterno,
        categoria: conteudo.categoria,
        tmdbId: conteudo.tmdbId,
        imdbId: conteudo.imdbId,
        titulo: conteudo.titulo,
        posterUrl: conteudo.posterUrl,
        temporadaNumero: ehSerie ? s : undefined,
        episodioNumero: ehSerie ? e : undefined,
        temporadaId: ehSerie ? String(s) : undefined,
        episodioId: ehSerie ? String(e) : undefined,
        tempoAtualSegundos: t,
        duracaoTotalSegundos: duracaoEstimada,
      });
      if (opts?.historico !== false) {
        registrarHistorico(
          {
            historicoKey: key,
            conteudoId: idInterno,
            idInterno,
            categoria: conteudo.categoria,
            tmdbId: conteudo.tmdbId,
            imdbId: conteudo.imdbId,
            titulo: conteudo.titulo,
            posterUrl: conteudo.posterUrl,
            temporadaNumero: ehSerie ? s : undefined,
            episodioNumero: ehSerie ? e : undefined,
            tempoAtualSegundos: t,
          },
          { forcar: opts?.forcarHistorico }
        );
      }
    },
    [conteudo, ehSerie, salvar, duracaoEstimada, idInterno]
  );

  useEffect(() => {
    if (!aceitouAviso) return;
    const id = setInterval(() => {
      if (!contandoRef.current || document.hidden) return;
      tempoRef.current = Math.min(tempoRef.current + 1, duracaoEstimada);
      setTempoAtual(tempoRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [aceitouAviso, duracaoEstimada]);

  useEffect(() => {
    if (!aceitouAviso) return;
    let acc = 0;
    const tick = setInterval(() => {
      if (!contandoRef.current || document.hidden) return;
      acc += 10;
      persistir(tempoRef.current, season, episode, {
        historico: acc >= 60,
      });
      if (acc >= 60) acc = 0;
    }, 10_000);

    function aoSair() {
      if (tempoRef.current >= 5) {
        persistir(tempoRef.current, season, episode, {
          historico: true,
          forcarHistorico: true,
        });
      }
    }
    window.addEventListener("beforeunload", aoSair);
    return () => {
      clearInterval(tick);
      window.removeEventListener("beforeunload", aoSair);
      aoSair();
    };
  }, [aceitouAviso, season, episode, persistir]);

  const embedUrl = useMemo(() => {
    const raw = ehSerie
      ? urlPlayerSerie(idsExternos, season, episode, fonteId)
      : urlPlayerFilme(idsExternos, fonteId);
    return urlHttpSegura(raw) ?? "";
  }, [idsExternos, ehSerie, season, episode, fonteId]);

  useEffect(() => {
    logPlayerDebug({
      titulo: conteudo.titulo,
      categoria: conteudo.categoria,
      idInterno,
      tmdbId: conteudo.tmdbId,
      imdbId: conteudo.imdbId,
      season: ehSerie ? season : undefined,
      episode: ehSerie ? episode : undefined,
      provider: fonteId,
      embedUrl: embedUrl || null,
    });
  }, [
    conteudo.titulo,
    conteudo.categoria,
    idInterno,
    conteudo.tmdbId,
    conteudo.imdbId,
    ehSerie,
    season,
    episode,
    fonteId,
    embedUrl,
  ]);

  // Fallback de fonte se embed vazio
  useEffect(() => {
    if (embedUrl) return;
    const atual = FONTES_PLAYER.findIndex((f) => f.id === fonteId);
    const proxima = FONTES_PLAYER[atual + 1];
    if (proxima) setFonteId(proxima.id);
  }, [embedUrl, fonteId]);

  const fonteAtual = FONTES_PLAYER.find((f) => f.id === fonteId);
  const temporadas = conteudo.temporadas ?? [];
  const temporadaAtual =
    temporadas.find((t) => t.numero === season) ?? temporadas[0];
  const episodios =
    temporadaAtual?.episodios?.length
      ? temporadaAtual.episodios
      : temporadaAtual?.totalEpisodios
        ? Array.from(
            {
              length: Math.min(
                200,
                Math.max(0, Math.floor(temporadaAtual.totalEpisodios))
              ),
            },
            (_, i) => ({
              id: String(i + 1),
              numero: i + 1,
            })
          )
        : [];

  function marcarPonto(segundos: number) {
    const t = Math.max(0, Math.min(duracaoEstimada, Math.floor(segundos)));
    tempoRef.current = t;
    setTempoAtual(t);
    persistir(t, season, episode, { historico: true, forcarHistorico: true });
  }

  function aceitarAviso() {
    if (naoMostrarAviso) {
      try {
        localStorage.setItem("novlyx-aviso-ads-ok", "1");
      } catch {
        /* ignore */
      }
    }
    setAceitouAviso(true);
  }

  function trocarTemporada(n: number) {
    resetarProgressoLocal();
    onSeasonChange(n);
  }

  function trocarEpisodio(n: number) {
    resetarProgressoLocal();
    onEpisodeChange(n);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <Link
          href={hrefConteudo(conteudo)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-medium">{conteudo.titulo}</h1>
          <p className="truncate text-[11px] text-white/40">
            {ehSerie ? `T${season} E${episode}` : conteudo.ano}
            {conteudo.tmdbId ? ` · TMDB ${conteudo.tmdbId}` : ""}
            {conteudo.imdbId ? ` · ${conteudo.imdbId}` : ""}
          </p>
        </div>
        {aceitouAviso && embedUrl ? (
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/35"
            aria-label="Abrir fonte"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
      <div className="relative mx-auto w-full max-w-6xl bg-black">
        <div className="relative aspect-video w-full">
          {!aceitouAviso ? (
            <div className="absolute inset-0 flex items-center justify-center bg-novlyx-graphite p-5">
              <div className="max-w-sm text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-novlyx-accent" />
                <p className="mt-3 text-sm text-white/60">
                  Fontes externas podem ter anúncios ou conteúdo +18.
                </p>
                <label className="mt-3 flex items-center justify-center gap-2 text-xs text-white/40">
                  <input
                    type="checkbox"
                    checked={naoMostrarAviso}
                    onChange={(e) => setNaoMostrarAviso(e.target.checked)}
                  />
                  Não mostrar de novo
                </label>
                <Button
                  type="button"
                  variant="accent"
                  className="mt-4 min-h-11 w-full"
                  onClick={aceitarAviso}
                >
                  Continuar
                </Button>
              </div>
            </div>
          ) : embedUrl ? (
            <iframe
              key={`${idInterno}:${fonteId}:${season}:${episode}:${embedUrl}`}
              src={embedUrl}
              title={conteudo.titulo}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/50">
              Sem ID externo válido para esta fonte (precisa TMDB ou IMDb)
            </div>
          )}
        </div>
      </div>
      {aceitouAviso && (
        <div className="mx-auto w-full max-w-6xl px-3 pb-10 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-[11px] tabular-nums text-white/50">
              {formatarTempoPlayer(tempoAtual)}
            </span>
            <Slider
              value={[tempoAtual]}
              max={duracaoEstimada}
              step={10}
              onValueChange={([v]) => {
                const t = v ?? 0;
                tempoRef.current = t;
                setTempoAtual(t);
              }}
              onValueCommit={([v]) => marcarPonto(v ?? 0)}
              className="flex-1"
            />
            <span className="w-12 shrink-0 text-right text-[11px] tabular-nums text-white/35">
              {formatarTempoPlayer(duracaoEstimada)}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={contando ? "accent" : "outline"}
              className="h-8 gap-1 px-2.5 text-[11px]"
              onClick={() => {
                setContando((v) => {
                  const next = !v;
                  contandoRef.current = next;
                  if (next) {
                    persistir(tempoRef.current, season, episode, {
                      historico: true,
                    });
                  }
                  return next;
                });
              }}
            >
              {contando ? (
                <>
                  <Pause className="h-3 w-3" /> Pausar marca
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" /> Contar marca
                </>
              )}
            </Button>
            {[
              ["-1m", -60],
              ["+1m", 60],
              ["25%", Math.floor(duracaoEstimada * 0.25)],
              ["50%", Math.floor(duracaoEstimada * 0.5)],
              ["75%", Math.floor(duracaoEstimada * 0.75)],
            ].map(([label, val]) => (
              <Button
                key={String(label)}
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-[11px] text-white/45 hover:text-white"
                onClick={() => {
                  if (typeof val === "number" && Math.abs(val) <= 120) {
                    marcarPonto(tempoRef.current + val);
                  } else {
                    marcarPonto(Number(val));
                  }
                }}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {FONTES_PLAYER.map((fonte) => (
              <Button
                key={fonte.id}
                size="sm"
                variant={fonteId === fonte.id ? "default" : "outline"}
                className={cn(
                  "h-7 px-2 text-[11px]",
                  fonteId === fonte.id
                    ? "bg-novlyx-accent text-black hover:bg-novlyx-accent/90"
                    : "border-white/10 text-white/50"
                )}
                onClick={() => setFonteId(fonte.id)}
              >
                {fonte.badge}
              </Button>
            ))}
          </div>

          {ehSerie && (
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="text-[11px] text-white/45">
                T
                <select
                  className="ml-1 rounded border border-white/10 bg-black px-1.5 py-1 text-xs"
                  value={season}
                  onChange={(e) => trocarTemporada(Number(e.target.value))}
                >
                  {temporadas.length > 0 ? (
                    temporadas.map((t) => (
                      <option key={t.id} value={t.numero}>
                        {t.numero === 0 ? "Esp" : t.numero}
                      </option>
                    ))
                  ) : (
                    <option value={season}>{season}</option>
                  )}
                </select>
              </label>
              <label className="text-[11px] text-white/45">
                E
                <select
                  className="ml-1 rounded border border-white/10 bg-black px-1.5 py-1 text-xs"
                  value={episode}
                  onChange={(e) => trocarEpisodio(Number(e.target.value))}
                  disabled={episodios.length === 0}
                >
                  {episodios.length > 0 ? (
                    episodios.map((ep) => (
                      <option key={ep.numero} value={ep.numero}>
                        {ep.numero}
                      </option>
                    ))
                  ) : (
                    <option value={episode}>{episode}</option>
                  )}
                </select>
              </label>
              {episodios.length === 0 && (
                <span className="text-[10px] text-white/30">
                  Lista de episódios indisponível nesta temporada
                </span>
              )}
            </div>
          )}

          {fonteAtual && (
            <p className="mt-3 text-[10px] text-white/25">
              {fonteAtual.nome}
              {fonteAtual.preferenciaSerie === "tmdb"
                ? " · ID preferido: TMDB"
                : " · ID preferido: IMDb"}
              {" · arraste a barra ou use 25/50/75% para marcar onde parou"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
