"use client";

import { useSearchParams } from "next/navigation";
import { ConteudoDetalhado } from "@/types";
import { PlayerVideo } from "@/components/features/player/player-video";
import {
  WatchPartyBanner,
  BotaoWatchParty,
} from "@/components/features/watch-party";

export function PlayerPageClient({ conteudo }: { conteudo: ConteudoDetalhado }) {
  const searchParams = useSearchParams();
  const temporadaId = searchParams.get("temporada") ?? searchParams.get("s") ?? undefined;
  const episodioId = searchParams.get("episodio") ?? searchParams.get("e") ?? undefined;
  const ehSerie =
    conteudo.categoria === "serie" ||
    conteudo.categoria === "anime" ||
    conteudo.categoria === "dorama";
  const season = Number(temporadaId) || 1;
  const episode = Number(episodioId) || 1;

  return (
    <>
      <div className="px-3 pt-3">
        <WatchPartyBanner
          conteudoId={conteudo.id}
          titulo={conteudo.titulo}
          season={season}
          episode={episode}
          ehSerie={ehSerie}
        />
      </div>
      <PlayerVideo
        conteudo={conteudo}
        temporadaIdInicial={temporadaId}
        episodioIdInicial={episodioId}
      />
      <div className="mx-auto max-w-6xl px-3 pb-10">
        <BotaoWatchParty
          conteudoId={conteudo.id}
          titulo={conteudo.titulo}
          season={season}
          episode={episode}
          ehSerie={ehSerie}
        />
      </div>
    </>
  );
}
