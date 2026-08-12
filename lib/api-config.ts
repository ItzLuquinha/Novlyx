

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.2embed.cc";

export const PLAYER_BASE_URL =
  process.env.NEXT_PUBLIC_PLAYER_BASE_URL ?? "https://embedplayapi.top";

export const USAR_PROXY = process.env.NEXT_PUBLIC_USAR_PROXY !== "false";

export const API_ROTAS = {
  filmesTrending: "/trending",
  filmePorImdb: (imdbId: string) => `/movie?imdb_id=${imdbId}`,
  filmePorTmdb: (tmdbId: string | number) => `/movie?tmdb_id=${tmdbId}`,
  buscaFilmes: "/search",
  similaresFilmes: "/similar",

  seriesTrending: "/trendingtv",
  seriePorImdb: (imdbId: string) => `/tv?imdb_id=${imdbId}`,
  seriePorTmdb: (tmdbId: string | number) => `/tv?tmdb_id=${tmdbId}`,
  buscaSeries: "/searchtv",
  similaresSeries: "/similartv",

  
  
  
  playerFilme: (id: string | number) => `${PLAYER_BASE_URL}/embed/${id}`,
  playerSerie: (id: string | number, season: number, episode: number) =>
    `${PLAYER_BASE_URL}/embed/${id}/${season}/${episode}`,
} as const;

export const API_HABILITADA = Boolean(API_BASE_URL);
