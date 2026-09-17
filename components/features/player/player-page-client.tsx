"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConteudoDetalhado } from "@/types";
import { PlayerVideo } from "@/components/features/player/player-video";
import {
  WatchPartyBanner,
  BotaoWatchParty,
} from "@/components/features/watch-party";
import { ehSerieLike } from "@/lib/identidade";

function numeroDeParam(valor?: string | null): number | null {
  if (!valor) return null;
  const n = Number(String(valor).replace(/\D/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function PlayerPageClient({ conteudo }: { conteudo: ConteudoDetalhado }) {
  const searchParams = useSearchParams();
  const ehSerie = ehSerieLike(conteudo.categoria);

  const seasonUrl =
    numeroDeParam(searchParams.get("temporada") ?? searchParams.get("s")) ??
    conteudo.temporadas?.find((t) => t.numero >= 1)?.numero ??
    conteudo.temporadas?.[0]?.numero ??
    1;
  const episodeUrl =
    numeroDeParam(searchParams.get("episodio") ?? searchParams.get("e")) ?? 1;

  const [season, setSeason] = useState(seasonUrl);
  const [episode, setEpisode] = useState(episodeUrl);

  const idInterno = conteudo.idInterno || conteudo.id;

  const watchPartyIds = useMemo(
    () => ({
      conteudoId: idInterno,
      categoria: conteudo.categoria,
      tmdbId: conteudo.tmdbId,
      imdbId: conteudo.imdbId,
      titulo: conteudo.titulo,
    }),
    [idInterno, conteudo.categoria, conteudo.tmdbId, conteudo.imdbId, conteudo.titulo]
  );

  return (
    <>
      <div className="px-3 pt-3">
        <WatchPartyBanner
          {...watchPartyIds}
          season={season}
          episode={episode}
          ehSerie={ehSerie}
        />
      </div>
      <PlayerVideo
        key={idInterno}
        conteudo={conteudo}
        season={season}
        episode={episode}
        onSeasonChange={(s) => {
          setSeason(s);
          setEpisode(1);
        }}
        onEpisodeChange={(e) => setEpisode(e)}
      />
      <div className="mx-auto max-w-6xl px-3 pb-10">
        <BotaoWatchParty
          {...watchPartyIds}
          season={season}
          episode={episode}
          ehSerie={ehSerie}
        />
      </div>
    </>
  );
}
