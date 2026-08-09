"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Nivel = "otima" | "boa" | "ok" | "fraca" | "offline" | "medindo" | "idle";

interface Resultado {
  mbps: number;
  nivel: Nivel;
  rotulo: string;
  dica: string;
}

function classificar(mbps: number): Omit<Resultado, "mbps"> {
  if (mbps >= 25)
    return {
      nivel: "otima",
      rotulo: "Ótima",
      dica: "4K e multi-áudio sem travar.",
    };
  if (mbps >= 10)
    return {
      nivel: "boa",
      rotulo: "Boa",
      dica: "Full HD estável para filmes e séries.",
    };
  if (mbps >= 5)
    return {
      nivel: "ok",
      rotulo: "Ok",
      dica: "HD leve. Evite 4K se oscilar.",
    };
  return {
    nivel: "fraca",
    rotulo: "Fraca",
    dica: "Prefira 480p/720p ou baixe antes.",
  };
}

const CORES: Record<Nivel, string> = {
  otima: "from-emerald-400/80 to-teal-500/60",
  boa: "from-novlyx-gold/80 to-amber-500/50",
  ok: "from-sky-400/70 to-blue-500/50",
  fraca: "from-orange-400/70 to-rose-500/50",
  offline: "from-zinc-500/50 to-zinc-600/40",
  medindo: "from-white/20 to-white/5",
  idle: "from-white/10 to-white/5",
};

const BARRAS = [0.2, 0.4, 0.6, 0.85, 1];

export function MedidorConexao() {
  const [estado, setEstado] = useState<Nivel>("idle");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [progresso, setProgresso] = useState(0);

  const medir = useCallback(async () => {
    if (!navigator.onLine) {
      setEstado("offline");
      setResultado({
        mbps: 0,
        nivel: "offline",
        rotulo: "Offline",
        dica: "Sem internet. Conecte-se para assistir.",
      });
      return;
    }

    setEstado("medindo");
    setResultado(null);
    setProgresso(0);

    const anim = setInterval(() => {
      setProgresso((p) => Math.min(p + 8, 90));
    }, 120);

    try {
      // Arquivo público pequeno/médio (Cloudflare) - ~100KB - 1MB via cache buster
      const url = `https://speed.cloudflare.com/__down?bytes=${500_000}&r=${Date.now()}`;
      const inicio = performance.now();
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("falha");
      const blob = await res.blob();
      const fim = performance.now();
      const segundos = Math.max((fim - inicio) / 1000, 0.001);
      const bits = blob.size * 8;
      const mbps = bits / segundos / 1_000_000;

      clearInterval(anim);
      setProgresso(100);
      const cls = classificar(mbps);
      setResultado({ mbps, ...cls });
      setEstado(cls.nivel);
    } catch {
      clearInterval(anim);
      // Fallback: Network Information API (aproximado)
      const conn = (navigator as Navigator & {
        connection?: { downlink?: number; effectiveType?: string };
      }).connection;

      if (conn?.downlink) {
        const mbps = conn.downlink;
        const cls = classificar(mbps);
        setResultado({ mbps, ...cls });
        setEstado(cls.nivel);
      } else {
        setEstado("ok");
        setResultado({
          mbps: 0,
          nivel: "ok",
          rotulo: "Indisponível",
          dica: "Não foi possível medir. Tente de novo.",
        });
      }
      setProgresso(100);
    }
  }, []);

  useEffect(() => {
    // Mede uma vez ao entrar na home (discreto)
    const t = setTimeout(() => {
      void medir();
    }, 800);
    return () => clearTimeout(t);
  }, [medir]);

  const nivel = resultado?.nivel ?? estado;
  const barrasAtivas =
    nivel === "otima"
      ? 5
      : nivel === "boa"
        ? 4
        : nivel === "ok"
          ? 3
          : nivel === "fraca"
            ? 2
            : nivel === "medindo"
              ? Math.ceil(progresso / 25)
              : 0;

  return (
    <section className="mx-auto w-full max-w-lg px-4 pb-4 pt-8">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5 shadow-xl shadow-black/30",
          CORES[nivel]
        )}
      >
        <div className="absolute inset-0 bg-novlyx-black/80 backdrop-blur-sm" />

        <div className="relative flex items-center gap-5">
          {/* Barras de sinal minimalistas */}
          <div className="flex h-12 items-end gap-1" aria-hidden>
            {BARRAS.map((h, i) => (
              <span
                key={i}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-500",
                  i < barrasAtivas
                    ? "bg-novlyx-gold"
                    : "bg-white/15",
                  estado === "medindo" && i < barrasAtivas && "animate-pulse"
                )}
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Sua conexão
            </p>
            {estado === "medindo" ? (
              <p className="mt-0.5 text-lg font-medium text-white/90">
                Medindo sinal…
              </p>
            ) : resultado ? (
              <>
                <p className="mt-0.5 flex items-baseline gap-2 text-lg font-medium text-white">
                  {resultado.rotulo}
                  {resultado.mbps > 0 && (
                    <span className="text-sm font-normal text-white/50">
                      {resultado.mbps.toFixed(1)} Mbps
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-white/50">{resultado.dica}</p>
              </>
            ) : (
              <p className="mt-0.5 text-lg font-medium text-white/70">
                Toque para medir
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void medir()}
            disabled={estado === "medindo"}
            className={cn(
              "shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors",
              "hover:border-novlyx-gold/40 hover:bg-white/5 hover:text-white",
              "disabled:cursor-wait disabled:opacity-50"
            )}
          >
            {estado === "medindo" ? "…" : "Medir"}
          </button>
        </div>

        {/* Linha de progresso sutil */}
        <div className="relative mt-4 h-px w-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-novlyx-gold/70 transition-all duration-300 ease-out"
            style={{
              width:
                estado === "medindo"
                  ? `${progresso}%`
                  : resultado
                    ? "100%"
                    : "0%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
