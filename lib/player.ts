import { PLAYER_BASE_URL } from "@/lib/api-config";
import { debugDev, normalizarImdb, normalizarTmdb } from "@/lib/identidade";
import type { CategoriaConteudo } from "@/types";

export type PreferenciaIdFonte = "tmdb" | "imdb";

export type FontePlayer = {
  id: string;
  nome: string;
  badge: string;
  supportsTmdb: boolean;
  supportsImdb: boolean;
  preferenciaFilme: PreferenciaIdFonte;
  preferenciaSerie: PreferenciaIdFonte;
  filme: (id: string) => string;
  serie: (id: string, season: number, episode: number) => string;
  temStatus: boolean;
};

const EMBEDPLAY_BASE = PLAYER_BASE_URL.replace(/\/$/, "");

export const FONTES_PLAYER: FontePlayer[] = [
  {
    id: "embedplay",
    nome: "EmbedPlay (BR)",
    badge: "BR",
    supportsTmdb: true,
    supportsImdb: true,
    preferenciaFilme: "tmdb",
    preferenciaSerie: "tmdb",
    filme: (id) => `${EMBEDPLAY_BASE}/embed/${id}`,
    serie: (id, s, e) => `${EMBEDPLAY_BASE}/embed/${id}/${s}/${e}`,
    temStatus: true,
  },
  {
    id: "warezcdn",
    nome: "WarezCDN (BR)",
    badge: "BR2",
    supportsTmdb: true,
    supportsImdb: true,
    preferenciaFilme: "imdb",
    preferenciaSerie: "imdb",
    filme: (id) => `https://warezcdn.lat/filme/${id}`,
    serie: (id, s, e) => `https://warezcdn.lat/serie/${id}/${s}/${e}`,
    temStatus: false,
  },
];

const FONTE_PADRAO: FontePlayer = FONTES_PLAYER[0] as FontePlayer;

export function resolverFonte(fonteId: string): FontePlayer {
  return FONTES_PLAYER.find((f) => f.id === fonteId) ?? FONTE_PADRAO;
}

export function idParaFonte(
  fonte: FontePlayer,
  ids: { tmdbId?: string; imdbId?: string },
  tipo: "filme" | "serie"
): string | null {
  const preferencia =
    tipo === "filme" ? fonte.preferenciaFilme : fonte.preferenciaSerie;
  const tmdb = normalizarTmdb(ids.tmdbId);
  const imdb = normalizarImdb(ids.imdbId);

  if (preferencia === "tmdb") {
    if (fonte.supportsTmdb && tmdb) return tmdb;
    if (fonte.supportsImdb && imdb) return imdb;
  } else {
    if (fonte.supportsImdb && imdb) return imdb;
    if (fonte.supportsTmdb && tmdb) return tmdb;
  }
  return null;
}

export function urlPlayerFilme(
  ids: { tmdbId?: string; imdbId?: string },
  fonteId: string = FONTE_PADRAO.id
): string | null {
  const fonte = resolverFonte(fonteId);
  const id = idParaFonte(fonte, ids, "filme");
  if (!id) return null;
  return fonte.filme(id);
}

export function urlPlayerSerie(
  ids: { tmdbId?: string; imdbId?: string },
  season: number,
  episode: number,
  fonteId: string = FONTE_PADRAO.id
): string | null {
  const fonte = resolverFonte(fonteId);
  const id = idParaFonte(fonte, ids, "serie");
  if (!id) return null;
  return fonte.serie(id, season, episode);
}

export function logPlayerDebug(payload: {
  titulo: string;
  categoria: CategoriaConteudo;
  idInterno: string;
  tmdbId?: string;
  imdbId?: string;
  season?: number;
  episode?: number;
  provider: string;
  embedUrl: string | null;
}) {
  debugDev("[PLAYER DEBUG]", payload);
}
