"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tv } from "lucide-react";
import {
  getJogosEsportivos,
  JogoEsportivo,
} from "@/services/esportes-ao-vivo.service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EsportesClient() {
  const [jogos, setJogos] = useState<JogoEsportivo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | "ao_vivo" | "agendado">(
    "todos"
  );

  useEffect(() => {
    let cancel = false;
    (async () => {
      setCarregando(true);
      try {
        const lista = await getJogosEsportivos();
        if (!cancel) setJogos(lista);
      } catch {
        if (!cancel) setJogos([]);
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const filtrados = useMemo(() => {
    if (filtro === "todos") return jogos;
    return jogos.filter((j) => j.status === filtro);
  }, [jogos, filtro]);

  const aoVivo = jogos.filter((j) => j.status === "ao_vivo").length;

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Esportes</h1>
      <p className="mt-2 max-w-xl text-sm text-white/50">
        Placar e agenda (ESPN). A NOVLYX não transmite os jogos — para tentar
        canais ao vivo, use a TV.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(
          [
            ["todos", "Todos"],
            ["ao_vivo", `Ao vivo${aoVivo ? ` (${aoVivo})` : ""}`],
            ["agendado", "Próximos"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFiltro(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs",
              filtro === id
                ? "bg-novlyx-gold text-black"
                : "bg-white/5 text-white/55 hover:bg-white/10"
            )}
          >
            {label}
          </button>
        ))}
        <Link
          href="/tv-ao-vivo"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-novlyx-gold"
        >
          <Tv className="h-3.5 w-3.5" /> TV ao vivo
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {carregando &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}

        {!carregando && filtrados.length === 0 && (
          <p className="py-16 text-center text-sm text-white/45">
            Nenhum jogo neste filtro agora. Tente de novo mais tarde.
          </p>
        )}

        {filtrados.map((j) => (
          <div
            key={j.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-wide text-white/35">
                {j.competicao}
              </p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  j.status === "ao_vivo"
                    ? "bg-rose-500/20 text-rose-300"
                    : j.status === "encerrado"
                      ? "bg-white/5 text-white/40"
                      : "bg-sky-500/15 text-sky-300"
                )}
              >
                {j.status === "ao_vivo"
                  ? "AO VIVO"
                  : j.status === "encerrado"
                    ? "Final"
                    : j.statusTexto}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{j.casa}</p>
                <p className="truncate text-sm text-white/70">{j.fora}</p>
              </div>
              <div className="text-right tabular-nums">
                {j.status !== "agendado" ? (
                  <>
                    <p className="text-lg font-semibold text-white">
                      {j.placarCasa ?? 0}
                    </p>
                    <p className="text-lg font-semibold text-white/70">
                      {j.placarFora ?? 0}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-white/40">
                    {new Date(j.dataHora).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[11px] text-white/30">
        Dados de placar via ESPN · atualiza ao recarregar a página
      </p>
    </div>
  );
}
