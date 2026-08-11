"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, Pause, Play } from "lucide-react";
import { ConteudoDetalhado } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  FONTES_PLAYER,
  urlPlayerFilme,
  urlPlayerSerie,
} from "@/lib/player";
import { useProgressoConteudo } from "@/hooks/use-continuar-assistindo";
import { registrarHistorico } from "@/services/historico.service";
import { cn } from "@/lib/utils";
import { urlHttpSegura } from "@/lib/url-segura";
import { formatarTempoPlayer } from "@/utils/formatadores";

interface PlayerVideoProps {
  conteudo: ConteudoDetalhado;
  temporadaIdInicial?: string;
  episodioIdInicial?: string;
}

function numeroDeParam(valor?: string): number | null {
  if (!valor) return null;
  const n = Number(String(valor).replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function PlayerVideo({
  conteudo,
  temporadaIdInicial,
  episodioIdInicial,
}: PlayerVideoProps) {
  const ehSerie =
    conteudo.categoria === "serie" ||
    conteudo.categoria === "anime" ||
    conteudo.categoria === "dorama";

  const { progresso, salvar } = useProgressoConteudo(conteudo.id);

  const seasonInicial =
    numeroDeParam(temporadaIdInicial) ??
    numeroDeParam(
      conteudo.temporadas?.[0]
        ? String(conteudo.temporadas[0].numero)
        : undefined
    ) ??
    1;
  const episodeInicial = numeroDeParam(episodioIdInicial) ?? 1;

  const duracaoEstimada = useMemo(() => {
    if (ehSerie) return 45 * 60;
    const min = conteudo.duracaoMinutos;
    if (min && min > 20 && min < 400) return min * 60;
    return 120 * 60;
  }, [conteudo.duracaoMinutos, ehSerie]);

  const [season, setSeason] = useState(seasonInicial);
  const [episode, setEpisode] = useState(episodeInicial);
  const [fonteId, setFonteId] = useState(FONTES_PLAYER[0]?.id ?? "embedplay");
  const [aceitouAviso, setAceitouAviso] = useState(false);
  const [naoMostrarAviso, setNaoMostrarAviso] = useState(false);
  const [contando, setContando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [restaurado, setRestaurado] = useState(false);

  const tempoRef = useRef(0);
  const contandoRef = useRef(false);
  contandoRef.current = contando;

  useEffect(() => {
    try {
      if (localStorage.getItem("novlyx-aviso-ads-ok") === "1") {
        setAceitouAviso(true);
      }
    } catch {
      
    }
  }, []);

  useEffect(() => {
    if (!progresso || restaurado) return;
    const urlTemT = numeroDeParam(temporadaIdInicial) != null;
    const urlTemE = numeroDeParam(episodioIdInicial) != null;
    if (!urlTemT && progresso.temporadaNumero && progresso.temporadaNumero > 0) {
      setSeason(progresso.temporadaNumero);
    }
    if (!urlTemE && progresso.episodioNumero && progresso.episodioNumero > 0) {
      setEpisode(progresso.episodioNumero);
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
    temporadaIdInicial,
    episodioIdInicial,
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
      salvar({
        conteudoId: conteudo.id,
        categoria: conteudo.categoria,
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
            conteudoId: conteudo.id,
            categoria: conteudo.categoria,
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
    [conteudo, ehSerie, salvar, duracaoEstimada]
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
      ? urlPlayerSerie(conteudo.id, season, episode, fonteId)
      : urlPlayerFilme(conteudo.id, fonteId);
    return urlHttpSegura(raw) ?? "";
  }, [conteudo.id, ehSerie, season, episode, fonteId]);

  const fonteAtual = FONTES_PLAYER.find((f) => f.id === fonteId);
  const totalTemp =
    conteudo.temporadas?.length ?? conteudo.totalTemporadas ?? 1;
  const epsNaTemp =
    conteudo.temporadas?.find((t) => t.numero === season)?.totalEpisodios ??
    12;

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
        
      }
    }
    setAceitouAviso(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <Link
          href={`/conteudo/${conteudo.id}`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-medium">{conteudo.titulo}</h1>
          <p className="truncate text-[11px] text-white/40">
            {ehSerie ? `T${season} E${episode}` : conteudo.ano}
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
              key={embedUrl}
              src={embedUrl}
              title={conteudo.titulo}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/50">
              Fonte inválida
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
                  onChange={(e) => {
                    setSeason(Number(e.target.value));
                    setEpisode(1);
                  }}
                >
                  {Array.from({ length: totalTemp }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    )
                  )}
                </select>
              </label>
              <label className="text-[11px] text-white/45">
                E
                <select
                  className="ml-1 rounded border border-white/10 bg-black px-1.5 py-1 text-xs"
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                >
                  {Array.from(
                    { length: Math.min(epsNaTemp, 40) },
                    (_, i) => i + 1
                  ).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {fonteAtual && (
            <p className="mt-3 text-[10px] text-white/25">
              {fonteAtual.nome} · arraste a barra ou use 25/50/75% para marcar
              onde parou
            </p>
          )}
        </div>
      )}
    </div>
  );
}
