"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Pause,
  Play,
  VolumeX,
  Volume2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { ConteudoDetalhado } from "@/types";
import { Button } from "@/components/ui/button";
import {
  FONTES_PLAYER,
  urlPlayerFilme,
  urlPlayerSerie,
} from "@/lib/player";
import { useProgressoConteudo } from "@/hooks/use-continuar-assistindo";
import { registrarHistorico } from "@/services/historico.service";
import { cn } from "@/lib/utils";
import { urlHttpSegura } from "@/lib/url-segura";

interface PlayerVideoProps {
  conteudo: ConteudoDetalhado;
  temporadaIdInicial?: string;
  episodioIdInicial?: string;
}

type FeedbackTipo = "pause" | "play" | "mute" | "unmute" | "back" | "fwd" | null;

function formatarTempo(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, "0")}min`;
  }
  return `${m}min ${String(r).padStart(2, "0")}s`;
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
      conteudo.temporadas?.[0] ? String(conteudo.temporadas[0].numero) : undefined
    ) ??
    1;
  const episodeInicial = numeroDeParam(episodioIdInicial) ?? 1;

  const [season, setSeason] = useState(seasonInicial);
  const [episode, setEpisode] = useState(episodeInicial);
  const [fonteId, setFonteId] = useState(FONTES_PLAYER[0]!.id);
  const [aceitouAviso, setAceitouAviso] = useState(false);
  const [naoMostrarAviso, setNaoMostrarAviso] = useState(false);

  // Aviso de ads: só uma vez se marcado
  useEffect(() => {
    try {
      if (localStorage.getItem("novlyx-aviso-ads-ok") === "1") {
        setAceitouAviso(true);
      }
    } catch {
      /* ignore */
    }
  }, []);
  const [pausado, setPausado] = useState(false);
  const [mutado, setMutado] = useState(false);
  const [tempoSegundos, setTempoSegundos] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackTipo>(null);
  const [restaurado, setRestaurado] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tempoRef = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restaura progresso salvo (URL tem prioridade para T/E)
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
      setTempoSegundos(progresso.tempoAtualSegundos);
      tempoRef.current = progresso.tempoAtualSegundos;
    }
    setRestaurado(true);
  }, [progresso, restaurado, temporadaIdInicial, episodioIdInicial]);

  const mostrarFeedback = useCallback((tipo: FeedbackTipo) => {
    setFeedback(tipo);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 900);
  }, []);

  const enviarAoPlayer = useCallback((comando: string, valor?: number) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    // Alguns embeds ignoram; tentamos comandos comuns
    try {
      win.postMessage({ event: comando, value: valor }, "*");
      win.postMessage({ type: comando, value: valor }, "*");
      win.postMessage(JSON.stringify({ event: comando, value: valor }), "*");
    } catch {
      /* cross-origin */
    }
  }, []);

  const persistir = useCallback(
    (tempo: number, s: number, e: number) => {
      const duracaoEstimada = ehSerie
        ? 45 * 60
        : (conteudo.duracaoMinutos ?? 120) * 60;
      salvar({
        conteudoId: conteudo.id,
        categoria: conteudo.categoria,
        titulo: conteudo.titulo,
        posterUrl: conteudo.posterUrl,
        temporadaNumero: ehSerie ? s : undefined,
        episodioNumero: ehSerie ? e : undefined,
        temporadaId: ehSerie ? String(s) : undefined,
        episodioId: ehSerie ? String(e) : undefined,
        tempoAtualSegundos: Math.max(0, Math.floor(tempo)),
        duracaoTotalSegundos: duracaoEstimada,
      });
      registrarHistorico({
        conteudoId: conteudo.id,
        categoria: conteudo.categoria,
        titulo: conteudo.titulo,
        posterUrl: conteudo.posterUrl,
        temporadaNumero: ehSerie ? s : undefined,
        episodioNumero: ehSerie ? e : undefined,
        tempoAtualSegundos: Math.max(0, Math.floor(tempo)),
      });
    },
    [conteudo, ehSerie, salvar]
  );

  // Conta tempo só quando "tocando" (não pausado) e a aba está em foco
  useEffect(() => {
    if (!aceitouAviso) return;
    const id = setInterval(() => {
      if (pausado) return;
      if (document.hidden) return;
      // sem foco na janela = provavelmente não está assistindo
      if (typeof document.hasFocus === "function" && !document.hasFocus()) return;
      tempoRef.current += 1;
      setTempoSegundos(tempoRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [aceitouAviso, pausado]);

  // Salva periodicamente e ao sair (não avança tempo se pausado)
  useEffect(() => {
    if (!aceitouAviso) return;
    const tick = setInterval(() => {
      if (pausado || document.hidden) return;
      persistir(tempoRef.current, season, episode);
    }, 5_000);

    function aoSair() {
      persistir(tempoRef.current, season, episode);
    }
    window.addEventListener("beforeunload", aoSair);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) aoSair();
    });

    return () => {
      clearInterval(tick);
      window.removeEventListener("beforeunload", aoSair);
      persistir(tempoRef.current, season, episode);
    };
  }, [aceitouAviso, season, episode, persistir, pausado]);

  // Atalhos de teclado
  useEffect(() => {
    if (!aceitouAviso) return;

    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Pause / Break ou Space → pausa / retoma
      if (e.code === "Pause" || e.key === "Pause" || e.code === "Space") {
        e.preventDefault();
        setPausado((p) => {
          const next = !p;
          enviarAoPlayer(next ? "pause" : "play");
          enviarAoPlayer(next ? "stop" : "start");
          mostrarFeedback(next ? "pause" : "play");
          return next;
        });
        return;
      }

      // F → mute / unmute
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setMutado((m) => {
          const next = !m;
          enviarAoPlayer(next ? "mute" : "unmute");
          enviarAoPlayer("volume", next ? 0 : 1);
          mostrarFeedback(next ? "mute" : "unmute");
          return next;
        });
        return;
      }

      // ← → ±5s (no progresso salvo; tenta avisar o embed)
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        tempoRef.current = Math.max(0, tempoRef.current - 5);
        setTempoSegundos(tempoRef.current);
        enviarAoPlayer("seek", tempoRef.current);
        enviarAoPlayer("seekBackward", 5);
        mostrarFeedback("back");
        persistir(tempoRef.current, season, episode);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        tempoRef.current = tempoRef.current + 5;
        setTempoSegundos(tempoRef.current);
        enviarAoPlayer("seek", tempoRef.current);
        enviarAoPlayer("seekForward", 5);
        mostrarFeedback("fwd");
        persistir(tempoRef.current, season, episode);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aceitouAviso, enviarAoPlayer, mostrarFeedback, persistir, season, episode]);

  const embedUrl = useMemo(() => {
    const raw = ehSerie
      ? urlPlayerSerie(conteudo.id, season, episode, fonteId)
      : urlPlayerFilme(conteudo.id, fonteId);
    return urlHttpSegura(raw) ?? "";
  }, [conteudo.id, ehSerie, season, episode, fonteId]);

  const fonteAtual = FONTES_PLAYER.find((f) => f.id === fonteId);

  const temProgressoSalvo =
    restaurado &&
    progresso &&
    (progresso.tempoAtualSegundos > 30 ||
      (progresso.episodioNumero && progresso.episodioNumero > 1) ||
      (progresso.temporadaNumero && progresso.temporadaNumero > 1));

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <Link href={`/conteudo/${conteudo.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-white sm:text-base">
            {conteudo.titulo}
          </h1>
          <p className="text-xs text-white/50">
            {conteudo.ano}
            {ehSerie ? ` · T${season} E${episode}` : ""}
            {tempoSegundos > 0 ? ` · ${formatarTempo(tempoSegundos)}` : ""}
            {fonteAtual ? ` · ${fonteAtual.nome}` : ""}
          </p>
        </div>
        {aceitouAviso && (
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block"
          >
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir
            </Button>
          </a>
        )}
      </div>

      <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
        {!aceitouAviso ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-6">
            <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Antes de assistir
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                O vídeo é carregado de{" "}
                <strong className="text-white/90">fontes de terceiros</strong>.
                Podem aparecer <strong className="text-white/90">anúncios</strong>,
                pop-ups ou conteúdo inadequado (incluindo material{" "}
                <strong className="text-amber-300/90">+18</strong>),{" "}
                <strong className="text-white/90">
                  fora do controle da NOVLYX
                </strong>
                .
              </p>
              {temProgressoSalvo && (
                <p className="mt-3 rounded-lg border border-novlyx-gold/20 bg-novlyx-gold/5 px-3 py-2 text-xs text-novlyx-gold/90">
                  Continuando de{" "}
                  {ehSerie && progresso?.temporadaNumero
                    ? `T${progresso.temporadaNumero} E${progresso.episodioNumero ?? 1} · `
                    : ""}
                  {formatarTempo(progresso?.tempoAtualSegundos ?? 0)}
                </p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Não hospedamos o arquivo nem operamos esses players. Atalhos:{" "}
                <span className="text-white/55">Pause/Espaço</span> pausa ·{" "}
                <span className="text-white/55">F</span> mudo ·{" "}
                <span className="text-white/55">← →</span> ±5s no progresso
                salvo.
              </p>
              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 text-xs text-white/50">
                <input
                  type="checkbox"
                  checked={naoMostrarAviso}
                  onChange={(e) => setNaoMostrarAviso(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/30 bg-white/10 accent-novlyx-gold"
                />
                Não mostrar este aviso de novo
              </label>
              <Button
                className="mt-4 w-full bg-novlyx-gold text-black hover:bg-novlyx-gold/90"
                onClick={() => {
                  if (naoMostrarAviso) {
                    try {
                      localStorage.setItem("novlyx-aviso-ads-ok", "1");
                    } catch {
                      /* ignore */
                    }
                  }
                  setAceitouAviso(true);
                  // Garante entrada no Continuar assistindo
                  const t0 = Math.max(tempoRef.current, 15);
                  tempoRef.current = t0;
                  setTempoSegundos(t0);
                  persistir(t0, season, episode);
                }}
              >
                Entendi, continuar
              </Button>
              <Link
                href={`/conteudo/${conteudo.id}`}
                className="mt-3 block text-xs text-white/40 hover:text-white/70"
              >
                Voltar aos detalhes
              </Link>
            </div>
          </div>
        ) : (
          <>
            {embedUrl ? (
            <iframe
              ref={iframeRef}
              key={embedUrl}
              src={embedUrl}
              title={conteudo.titulo}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
              Fonte de vídeo inválida.
            </div>
          )}
            {pausado && (
              <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs text-white/80 backdrop-blur">
                Progresso pausado · Espaço para retomar
              </div>
            )}
            {/* HUD de atalho */}
            {feedback && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                  {feedback === "pause" && <Pause className="h-7 w-7 fill-current" />}
                  {feedback === "play" && <Play className="h-7 w-7 fill-current" />}
                  {feedback === "mute" && <VolumeX className="h-7 w-7" />}
                  {feedback === "unmute" && <Volume2 className="h-7 w-7" />}
                  {feedback === "back" && (
                    <span className="flex flex-col items-center text-xs">
                      <RotateCcw className="h-5 w-5" />
                      -5s
                    </span>
                  )}
                  {feedback === "fwd" && (
                    <span className="flex flex-col items-center text-xs">
                      <RotateCw className="h-5 w-5" />
                      +5s
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/50">Fonte:</span>
          {FONTES_PLAYER.map((fonte) => (
            <Button
              key={fonte.id}
              size="sm"
              variant={fonteId === fonte.id ? "default" : "outline"}
              className={cn(
                "h-8 text-xs",
                fonteId === fonte.id
                  ? "bg-novlyx-gold text-black hover:bg-novlyx-gold/90"
                  : "border-white/20 text-white hover:bg-white/10"
              )}
              onClick={() => setFonteId(fonte.id)}
            >
              {fonte.badge === "BR" && (
                <span className="mr-1 text-[10px] opacity-80">🇧🇷</span>
              )}
              {fonte.nome}
            </Button>
          ))}
        </div>

        {ehSerie && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white/70">
              Temporada
              <input
                type="number"
                min={1}
                max={conteudo.totalTemporadas || 50}
                value={season}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value) || 1);
                  setSeason(v);
                  persistir(tempoRef.current, v, episode);
                }}
                className="h-9 w-20 rounded-md border border-white/15 bg-white/5 px-2 text-white outline-none focus:border-novlyx-gold/50"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              Episódio
              <input
                type="number"
                min={1}
                value={episode}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value) || 1);
                  setEpisode(v);
                  tempoRef.current = 0;
                  setTempoSegundos(0);
                  persistir(0, season, v);
                }}
                className="h-9 w-20 rounded-md border border-white/15 bg-white/5 px-2 text-white outline-none focus:border-novlyx-gold/50"
              />
            </label>
          </div>
        )}

        <p className="text-[11px] text-white/35">
          Atalhos: Pause ou Espaço · F mudo · ← → ±5s no progresso · Continuamos de
          onde você parou (temporada, episódio e tempo).
        </p>

        <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-white/55">
          <p>
            Anúncios e pop-ups vêm das{" "}
            <strong className="text-white/80">fontes externas</strong>, não da
            NOVLYX. Se uma fonte falhar ou tiver muito ad, troque acima.
          </p>
        </div>
      </div>
    </div>
  );
}
