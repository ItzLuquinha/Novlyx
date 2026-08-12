export type FontePlayer = {
  id: string;
  nome: string;
  badge: string;
  filme: (id: string) => string;
  serie: (id: string, season: number, episode: number) => string;
};

/**
 * Somente fontes BR.
 * 1) EmbedPlay - principal
 * 2) WarezCDN - alternativa BR (embedplayapi.site nao responde)
 */
export const FONTES_PLAYER: FontePlayer[] = [
  {
    id: "embedplay",
    nome: "EmbedPlay (BR)",
    badge: "BR",
    filme: (id) => `https://embedplayapi.top/embed/${id}`,
    serie: (id, s, e) => `https://embedplayapi.top/embed/${id}/${s}/${e}`,
  },
  {
    id: "warezcdn",
    nome: "WarezCDN (BR)",
    badge: "BR2",
    filme: (id) => `https://warezcdn.lat/filme/${id}`,
    serie: (id, s, e) => `https://warezcdn.lat/serie/${id}/${s}/${e}`,
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
