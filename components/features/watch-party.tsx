"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WatchPartyProps {
  conteudoId: string;
  titulo: string;
  season?: number;
  episode?: number;
  ehSerie?: boolean;
}

export function WatchPartyBanner({
  conteudoId,
  titulo,
  season = 1,
  episode = 1,
  ehSerie = false,
}: WatchPartyProps) {
  const params = useSearchParams();
  const isParty = params.get("wp") === "1";
  const host = params.get("host") || "alguém";
  const s = Number(params.get("s") || season) || 1;
  const e = Number(params.get("e") || episode) || 1;

  if (!isParty) return null;

  return (
    <div className="mx-auto mb-3 flex w-full max-w-6xl items-center gap-3 rounded-xl border border-novlyx-gold/30 bg-novlyx-gold/10 px-3 py-2.5">
      <Users className="h-4 w-4 shrink-0 text-novlyx-gold" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium text-novlyx-gold">Watch party</p>
        <p className="truncate text-xs text-white/55">
          {host} convidou você · {titulo}
          {ehSerie ? ` · T${s} E${e}` : ""}
        </p>
      </div>
    </div>
  );
}

export function BotaoWatchParty({
  conteudoId,
  titulo,
  season = 1,
  episode = 1,
  ehSerie = false,
}: WatchPartyProps) {
  const [copiado, setCopiado] = useState(false);
  const [nome, setNome] = useState("Eu");

  const link = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL(`/player/${conteudoId}`, window.location.origin);
    u.searchParams.set("wp", "1");
    u.searchParams.set("host", nome.slice(0, 20) || "amigo");
    if (ehSerie) {
      u.searchParams.set("s", String(season));
      u.searchParams.set("e", String(episode));
      u.searchParams.set("temporada", String(season));
      u.searchParams.set("episodio", String(episode));
    }
    return u.toString();
  }, [conteudoId, nome, season, episode, ehSerie]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs font-medium text-white/70">Watch party</p>
      <p className="mt-1 text-[11px] text-white/40">
        Gera um link com o episódio. Quem abrir vê o mesmo ponto combinado.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={20}
          placeholder="Seu nome"
          className="h-8 min-w-[6rem] flex-1 rounded-md border border-white/10 bg-black px-2 text-xs text-white"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1 border-white/15 text-xs"
          onClick={() => void copiar()}
        >
          {copiado ? (
            <>
              <Check className="h-3 w-3" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copiar link
            </>
          )}
        </Button>
      </div>
      {ehSerie && (
        <p className="mt-2 text-[10px] text-white/30">
          Link aponta para T{season} E{episode}
        </p>
      )}
    </div>
  );
}
