/**
 * Fontes de player (ordem de preferência para público BR).
 */

export type FontePlayer = {
  id: string;
  nome: string;
  badge: string;
  filme: (id: string) => string;
  serie: (id: string, season: number, episode: number) => string;
};

export const FONTES_PLAYER: FontePlayer[] = [
  {
    id: "embedplay",
    nome: "EmbedPlay (BR)",
    badge: "BR",
    filme: (id) => `https://embedplayapi.top/embed/${id}`,
    serie: (id, s, e) => `https://embedplayapi.top/embed/${id}/${s}/${e}`,
  },
  {
    id: "multiembed",
    nome: "Multiembed",
    badge: "Multi",
    filme: (id) => {
      if (id.startsWith("tt")) {
        return `https://multiembed.mov/?video_id=${id}`;
      }
      return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
    },
    serie: (id, s, e) => {
      if (id.startsWith("tt")) {
        return `https://multiembed.mov/?video_id=${id}&s=${s}&e=${e}`;
      }
      return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`;
    },
  },
  {
    id: "2embed",
    nome: "2Embed",
    badge: "2E",
    filme: (id) => `https://www.2embed.cc/embed/${id}`,
    serie: (id, s, e) =>
      `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: "vidsrc",
    nome: "VidSrc",
    badge: "VS",
    filme: (id) => {
      const base = id.startsWith("tt")
        ? `https://vidsrc-embed.ru/embed/movie?imdb=${id}`
        : `https://vidsrc-embed.ru/embed/movie?tmdb=${id}`;
      return `${base}&ds_lang=pt`;
    },
    serie: (id, s, e) => {
      const base = id.startsWith("tt")
        ? `https://vidsrc-embed.ru/embed/tv?imdb=${id}`
        : `https://vidsrc-embed.ru/embed/tv?tmdb=${id}`;
      return `${base}&season=${s}&episode=${e}&ds_lang=pt`;
    },
  },
];

const FONTE_PADRAO: FontePlayer = FONTES_PLAYER[0] as FontePlayer;

function resolverFonte(fonteId: string): FontePlayer {
  return FONTES_PLAYER.find((f) => f.id === fonteId) ?? FONTE_PADRAO;
}

export function urlPlayerFilme(
  id: string | number,
  fonteId: string = FONTE_PADRAO.id
): string {
  return resolverFonte(fonteId).filme(String(id));
}

export function urlPlayerSerie(
  id: string | number,
  season: number,
  episode: number,
  fonteId: string = FONTE_PADRAO.id
): string {
  return resolverFonte(fonteId).serie(String(id), season, episode);
}
