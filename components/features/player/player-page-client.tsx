"use client";

import { useSearchParams } from "next/navigation";
import { ConteudoDetalhado } from "@/types";
import { PlayerVideo } from "@/components/features/player/player-video";

export function PlayerPageClient({ conteudo }: { conteudo: ConteudoDetalhado }) {
  const searchParams = useSearchParams();
  const temporadaId = searchParams.get("temporada") ?? undefined;
  const episodioId = searchParams.get("episodio") ?? undefined;

  return (
    <PlayerVideo
      conteudo={conteudo}
      temporadaIdInicial={temporadaId}
      episodioIdInicial={episodioId}
    />
  );
}
