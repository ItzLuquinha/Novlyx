"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Sparkles,
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
import { ControlesPlayer } from "@/components/features/player/controles-player";
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
    return Math.max((conteudo.duracaoMinutos ?? 120) * 60, 30 * 60);
  }, [conteudo.duracaoMinutos, ehSerie]);

  const [season, setSeason] = useState(seasonInicial);
  const [episode, setEpisode] = useState(episodeInicial);
  const [fonteId, setFonteId] = useState(FONTES_PLAYER[0]?.id ?? "embedplay");
  const [aceitouAviso, setAceitouAviso] = useState(false);
  const [naoMostrarAviso, setNaoMostrarAviso] = useState(false);

  const [tocando, setTocando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [volume, setVolume] = useState(80);
  const [mudo, setMudo] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);
  const [controlesVisiveis, setControlesVisiveis] = useState(true);
  const [sincronizadoEmbed, setSincronizadoEmbed] = useState(false);
  const [restaurado, setRestaurado] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const tempoRef = useRef(0);
  const tocandoRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  tocandoRef.current = tocando;

  useEffect(() => {
    try {
      if (localStorage.getItem("novlyx-aviso-ads-ok") === "1") {
        setAceitouAviso(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Restaura onde parou
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
      const t = Math.min(progresso.tempoAtualSegundos, duracaoEstimada - 5);
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

  const enviarAoPlayer = useCallback((comando: string, valor?: number) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage({ event: comando, value: valor }, "*");
      win.postMessage({ type: comando, value: valor }, "*");
      win.postMessage(JSON.stringify({ event: comando, value: valor }), "*");
    } catch {
      /* cross-origin */
    }
  }, []);

  const persistir = useCallback(
    (
      tempo: number,
      s: number,
      e: number,
      opts?: { historico?: boolean; forcarHistorico?: boolean }
    ) => {
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
      if (opts?.historico !== false) {
        registrarHistorico(
          {
            conteudoId: conteudo.id,
            categoria: conteudo.categoria,
            titulo: conteudo.titulo,
            posterUrl: conteudo.posterUrl,
            temporadaNumero: ehSerie ? s : undefined,
            episodioNumero: ehSerie ? e : undefined,
            tempoAtualSegundos: Math.max(0, Math.floor(tempo)),
          },
          { forcar: opts?.forcarHistorico }
        );
      }
    },
    [conteudo, ehSerie, salvar, duracaoEstimada]
  );

  // Relógio interno só quando "tocando" (fonte da verdade da barra)
  useEffect(() => {
    if (!aceitouAviso) return;
    const id = setInterval(() => {
      if (!tocandoRef.current) return;
      if (document.hidden) return;
      tempoRef.current = Math.min(tempoRef.current + 1, duracaoEstimada);
      setTempoAtual(tempoRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [aceitouAviso, duracaoEstimada]);

  // Salvar progresso
  useEffect(() => {
    if (!aceitouAviso) return;
    let acc = 0;
    const tick = setInterval(() => {
      if (!tocandoRef.current || document.hidden) return;
      acc += 5;
      persistir(tempoRef.current, season, episode, {
        historico: acc >= 60,
      });
      if (acc >= 60) acc = 0;
    }, 5_000);

    function aoSair() {
      persistir(tempoRef.current, season, episode, {
        historico: true,
        forcarHistorico: true,
      });
    }
    window.addEventListener("beforeunload", aoSair);
    const onVis = () => {
      if (document.hidden) {
        setTocando(false);
        tocandoRef.current = false;
        aoSair();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearInterval(tick);
      window.removeEventListener("beforeunload", aoSair);
      document.removeEventListener("visibilitychange", onVis);
      persistir(tempoRef.current, season, episode, {
        historico: true,
        forcarHistorico: true,
      });
    };
  }, [aceitouAviso, season, episode, persistir]);

  // postMessage: se o embed mandar tempo/pause, sincroniza a barra
  useEffect(() => {
    if (!aceitouAviso) return;

    function onMessage(ev: MessageEvent) {
      let data: unknown = ev.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          data = { event: data };
        }
      }
      if (!data || typeof data !== "object") return;
      const d = data as Record<string, unknown>;
      const evName = String(
        d.event ?? d.type ?? d.action ?? d.method ?? ""
      ).toLowerCase();

      if (
        /pause|paused|stop|ended|finish/.test(evName) ||
        d.paused === true ||
        d.playing === false
      ) {
        setTocando(false);
        tocandoRef.current = false;
      }
      if (
        /play|playing|start|resume/.test(evName) ||
        d.paused === false ||
        d.playing === true
      ) {
        setTocando(true);
        tocandoRef.current = true;
      }

      const tRaw =
        typeof d.currentTime === "number"
          ? d.currentTime
          : typeof d.seconds === "number"
            ? d.seconds
            : typeof d.time === "number"
              ? d.time
              : null;
      if (tRaw != null && tRaw >= 0 && tRaw < 3600 * 10) {
        const t = Math.floor(tRaw);
        tempoRef.current = t;
        setTempoAtual(t);
        setSincronizadoEmbed(true);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [aceitouAviso]);

  // Esconde controles após idle no shell
  const revelarControles = useCallback(() => {
    setControlesVisiveis(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (tocandoRef.current) setControlesVisiveis(false);
    }, 3200);
  }, []);

  // Teclado
  useEffect(() => {
    if (!aceitouAviso) return;

    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.code === "Space" || e.key === " " || e.code === "Pause") {
        e.preventDefault();
        setTocando((v) => {
          const next = !v;
          tocandoRef.current = next;
          enviarAoPlayer(next ? "play" : "pause");
          return next;
        });
        revelarControles();
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setMudo((m) => {
          const next = !m;
          enviarAoPlayer(next ? "mute" : "unmute");
          return next;
        });
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const t = Math.max(0, tempoRef.current - 5);
        tempoRef.current = t;
        setTempoAtual(t);
        enviarAoPlayer("seek", t);
        revelarControles();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const t = Math.min(duracaoEstimada, tempoRef.current + 5);
        tempoRef.current = t;
        setTempoAtual(t);
        enviarAoPlayer("seek", t);
        revelarControles();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aceitouAviso, enviarAoPlayer, duracaoEstimada, revelarControles]);

  // Fullscreen change
  useEffect(() => {
    function onFs() {
      setTelaCheia(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const embedUrl = useMemo(() => {
    const raw = ehSerie
      ? urlPlayerSerie(conteudo.id, season, episode, fonteId)
      : urlPlayerFilme(conteudo.id, fonteId);
    return urlHttpSegura(raw) ?? "";
  }, [conteudo.id, ehSerie, season, episode, fonteId]);

  const fonteAtual = FONTES_PLAYER.find((f) => f.id === fonteId);
  const totalTemp = conteudo.temporadas?.length ?? conteudo.totalTemporadas ?? 1;
  const epsNaTemp =
    conteudo.temporadas?.find((t) => t.numero === season)?.totalEpisodios ?? 12;

  const temAnterior = ehSerie && (episode > 1 || season > 1);
  const temProximo =
    ehSerie && (episode < epsNaTemp || season < totalTemp);

  function episodioAnterior() {
    if (episode > 1) setEpisode((e) => e - 1);
    else if (season > 1) {
      setSeason((s) => s - 1);
      setEpisode(1);
    }
  }

  function proximoEpisodio() {
    if (episode < epsNaTemp) setEpisode((e) => e + 1);
    else if (season < totalTemp) {
      setSeason((s) => s + 1);
      setEpisode(1);
    }
  }

  function alternarPlay() {
    setTocando((v) => {
      const next = !v;
      tocandoRef.current = next;
      enviarAoPlayer(next ? "play" : "pause");
      return next;
    });
    revelarControles();
  }

  function buscar(segundos: number) {
    const t = Math.max(0, Math.min(duracaoEstimada, Math.floor(segundos)));
    tempoRef.current = t;
    setTempoAtual(t);
    enviarAoPlayer("seek", t);
    revelarControles();
  }

  function alternarTelaCheia() {
    const el = shellRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      void el.requestFullscreen?.();
    } else {
      void document.exitFullscreen?.();
    }
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
    setTocando(true);
    tocandoRef.current = true;
    revelarControles();
  }

  const pct = duracaoEstimada > 0 ? (tempoAtual / duracaoEstimada) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={`/conteudo/${conteudo.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {conteudo.titulo}
            </h1>
            <p className="truncate text-xs text-white/45">
              {ehSerie ? `T${season} · E${episode}` : conteudo.ano}
              {sincronizadoEmbed ? " · sync embed" : " · progresso NOVLYX"}
            </p>
          </div>
        </div>
        {aceitouAviso && embedUrl && (
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-novlyx-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Abrir fonte</span>
          </a>
        )}
      </div>

      {/* Shell do player */}
      <div
        ref={shellRef}
        className="relative mx-auto aspect-video w-full max-w-6xl overflow-hidden bg-black sm:rounded-xl sm:ring-1 sm:ring-white/10"
        onMouseMove={revelarControles}
        onTouchStart={revelarControles}
      >
        {/* Glow criativo */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at ${pct}% 100%, rgba(201,162,39,0.18), transparent 55%)`,
          }}
        />

        {!aceitouAviso ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-black via-novlyx-graphite to-black p-6">
            <div className="max-w-md rounded-2xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md">
              <ShieldAlert className="mx-auto h-10 w-10 text-novlyx-gold" />
              <h2 className="mt-3 text-lg font-semibold">Antes de assistir</h2>
              <p className="mt-2 text-sm text-white/55">
                O vídeo vem de fontes externas. Podem aparecer anúncios ou
                conteúdo +18 fora do nosso controle. Use um bloqueador se
                quiser.
              </p>
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-xs text-white/45">
                <input
                  type="checkbox"
                  checked={naoMostrarAviso}
                  onChange={(e) => setNaoMostrarAviso(e.target.checked)}
                  className="rounded border-white/20"
                />
                Não mostrar de novo neste dispositivo
              </label>
              <Button
                type="button"
                variant="gold"
                className="mt-5 min-h-11 w-full"
                onClick={aceitarAviso}
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
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/50">
                Fonte de vídeo inválida.
              </div>
            )}

            {/* Faixa de progresso fina sempre visível */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
              <div
                className="h-full bg-novlyx-gold transition-[width] duration-1000 linear"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Controles nativos NOVLYX */}
            <ControlesPlayer
              tocando={tocando}
              tempoAtual={tempoAtual}
              duracaoTotal={duracaoEstimada}
              volume={volume}
              mudo={mudo}
              telaCheia={telaCheia}
              temProximo={temProximo}
              temAnterior={temAnterior}
              visivel={controlesVisiveis}
              onAlternarPlay={alternarPlay}
              onBuscar={buscar}
              onAlternarVolume={() => {
                setMudo((m) => {
                  const next = !m;
                  enviarAoPlayer(next ? "mute" : "unmute");
                  return next;
                });
              }}
              onMudarVolume={(v) => {
                setVolume(v);
                setMudo(v === 0);
                enviarAoPlayer("volume", v);
              }}
              onAlternarTelaCheia={alternarTelaCheia}
              onProximoEpisodio={proximoEpisodio}
              onEpisodioAnterior={episodioAnterior}
            />

            {!tocando && controlesVisiveis && (
              <button
                type="button"
                onClick={alternarPlay}
                className="absolute left-1/2 top-1/2 z-[5] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-novlyx-gold text-black shadow-lg shadow-novlyx-gold/30"
                aria-label="Retomar contagem de progresso"
              >
                <Sparkles className="h-6 w-6" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Painel inferior */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-novlyx-gold/70">
              Onde você parou
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-white">
              {formatarTempoPlayer(tempoAtual)}
              <span className="text-sm font-normal text-white/35">
                {" "}
                / {formatarTempoPlayer(duracaoEstimada)}
              </span>
            </p>
            <p className="mt-1 max-w-md text-xs text-white/40">
              A barra abaixo do vídeo é a memória da NOVLYX. Arraste para
              marcar o ponto. Espaço pausa · setas ±5s · F mudo.
            </p>
          </div>
          <div className="text-right text-xs text-white/40">
            <p>
              Status:{" "}
              <span className={tocando ? "text-novlyx-gold" : "text-white/60"}>
                {tocando ? "Contando" : "Pausado"}
              </span>
            </p>
            {sincronizadoEmbed && (
              <p className="text-emerald-400/80">Embed enviou tempo real</p>
            )}
          </div>
        </div>

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
                  : "border-white/15"
              )}
              onClick={() => setFonteId(fonte.id)}
            >
              {fonte.badge} {fonte.nome}
            </Button>
          ))}
        </div>

        {ehSerie && (
          <div className="flex flex-wrap gap-4">
            <label className="text-xs text-white/50">
              Temporada
              <select
                className="ml-2 rounded-md border border-white/15 bg-black px-2 py-1.5 text-sm text-white"
                value={season}
                onChange={(e) => {
                  setSeason(Number(e.target.value));
                  setEpisode(1);
                }}
              >
                {Array.from({ length: totalTemp }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-white/50">
              Episódio
              <select
                className="ml-2 rounded-md border border-white/15 bg-black px-2 py-1.5 text-sm text-white"
                value={episode}
                onChange={(e) => setEpisode(Number(e.target.value))}
              >
                {Array.from({ length: Math.min(epsNaTemp, 40) }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        )}

        {fonteAtual && (
          <p className="text-xs text-white/35">
            Reproduzindo via {fonteAtual.nome}. A NOVLYX não hospeda o arquivo
            de vídeo.
          </p>
        )}
      </div>
    </div>
  );
}
