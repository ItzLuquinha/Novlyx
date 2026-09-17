import {
  CategoriaConteudo,
  ConteudoDetalhado,
  ConteudoResumo,
  Genero,
  QualidadeVideo,
  ResultadoPaginado,
  Temporada,
} from "@/types";
import { tituloEmPortugues } from "@/lib/titulos-pt";
import {
  chaveEstavel,
  montarIdInterno,
  normalizarImdb,
  normalizarTmdb,
} from "@/lib/identidade";

export interface EmbedItem {
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  year?: string;
  first_air_year?: string;
  release_date?: string;
  first_air_date?: string;
  tmdb_id?: number;
  imdb_id?: string;
  embed_imdb?: string;
  embed_tmdb?: string;
  genres?: string[];
  plot?: string;
  overview?: string;
  vote_average?: number;
  poster?: string;
  backdrops?: string[];
  trailer?: string;
  runtime?: number;
  status?: string;
  original_language?: string;
  production_countries?: string[];
  spoken_languages?: string[];
  cast_crew?: {
    cast?: { name: string; character?: string; profile?: string | null }[];
    crew?: { name: string; job?: string }[];
  };
  cast?: { name: string; character?: string }[];
  crew?: { name: string; job?: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    season_number?: number;
    name?: string;
    air_date?: string;
    episode_count?: number;
    poster?: string | null;
  }[];
}

export interface EmbedListResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: EmbedItem[];
}

export const EMPTY_EMBED_LIST: EmbedListResponse = {
  page: 1,
  total_results: 0,
  total_pages: 1,
  results: [],
};

function slugGenero(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function mapGeneros(genres?: string[]): Genero[] {
  if (!genres?.length) return [];
  return genres.map((nome) => ({
    id: slugGenero(nome),
    nome,
  }));
}

function anoDe(item: EmbedItem): number {
  const raw =
    item.year ||
    item.first_air_year ||
    item.release_date?.slice(0, 4) ||
    item.first_air_date?.slice(0, 4) ||
    "0";
  return Number(raw) || 0;
}

export function idsDeItem(item: EmbedItem): {
  tmdbId?: string;
  imdbId?: string;
} {
  return {
    tmdbId: normalizarTmdb(item.tmdb_id),
    imdbId: normalizarImdb(item.imdb_id),
  };
}

export function temIdValido(item: EmbedItem): boolean {
  const { tmdbId, imdbId } = idsDeItem(item);
  return Boolean(tmdbId || imdbId);
}

function detectarEmCinema(item: EmbedItem): boolean {
  const status = (item.status || "").toLowerCase();
  if (
    status.includes("production") ||
    status.includes("post") ||
    status.includes("planned") ||
    status.includes("rumored")
  ) {
    return true;
  }

  const dataStr = item.release_date || item.first_air_date;
  if (dataStr) {
    const data = new Date(dataStr);
    const agora = new Date();
    const diffDias =
      (agora.getTime() - data.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDias < 0) return true;
    if (diffDias <= 45 && status.includes("released")) return true;
  }
  return false;
}

function rotuloIdioma(code?: string): string {
  if (!code) return "";
  const map: Record<string, string> = {
    en: "Inglês",
    pt: "Português",
    "pt-BR": "Português",
    "pt-br": "Português",
    es: "Espanhol",
    fr: "Francês",
    ja: "Japonês",
    ko: "Coreano",
    zh: "Chinês",
    de: "Alemão",
    it: "Italiano",
    hi: "Hindi",
  };
  return map[code] || code.toUpperCase();
}

function estimarQualidade(item: EmbedItem, emCinema: boolean): QualidadeVideo {
  if (emCinema) return "Cinema";

  const status = (item.status || "").toLowerCase();
  if (
    status.includes("production") ||
    status.includes("post") ||
    status.includes("planned")
  ) {
    return "Cinema";
  }

  const dataStr = item.release_date || item.first_air_date;
  if (dataStr) {
    const data = new Date(dataStr);
    const diffDias =
      (Date.now() - data.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDias < 0) return "Cinema";
    if (diffDias <= 90) return "HD";
  }

  const ano = anoDe(item);
  const anoAtual = new Date().getFullYear();
  if (ano >= anoAtual - 1) return "HD";
  if (ano > 0 && ano < 1990) return "HD";
  return "FULL HD";
}

function montarEpisodiosReais(
  numTemp: number,
  qtd: number,
  poster: string
): Temporada["episodios"] {
  const n = Math.max(0, Math.floor(qtd));
  if (n <= 0) return [];
  return Array.from({ length: n }, (_, j) => {
    const ep = j + 1;
    return {
      id: String(ep),
      numero: ep,
      temporadaId: String(numTemp),
      titulo: `Episódio ${ep}`,
      descricao: "",
      duracaoMinutos: 0,
      posterUrl: poster,
      dataLancamento: "",
    };
  });
}

export function mapearResumo(
  item: EmbedItem,
  categoria: CategoriaConteudo
): ConteudoResumo {
  const bruto = item.title || item.name || "Sem título";
  const original = item.original_title || item.original_name;
  const titulo = tituloEmPortugues(bruto, original);
  const banner =
    item.backdrops?.[0] ||
    item.poster ||
    "/placeholders/banner-default.svg";
  const idioma = item.original_language || "";
  const emCinema = detectarEmCinema(item);
  const { tmdbId, imdbId } = idsDeItem(item);
  const fallbackNome = `${titulo}-${anoDe(item) || ""}`;
  const idInterno = montarIdInterno(categoria, tmdbId, imdbId, fallbackNome);

  return {
    id: idInterno,
    idInterno,
    tmdbId,
    imdbId,
    titulo,
    tituloOriginal: original || undefined,
    categoria,
    ano: anoDe(item),
    nota: Number(item.vote_average?.toFixed?.(1) ?? item.vote_average ?? 0),
    qualidade: estimarQualidade(item, emCinema),
    posterUrl: item.poster || "/placeholders/poster-default.svg",
    bannerUrl: banner,
    generos: mapGeneros(item.genres),
    idiomaOriginal: idioma,
    statusLancamento: item.status,
    emCinema,
    adicionadoEm:
      item.release_date || item.first_air_date || new Date().toISOString(),
  };
}

export function mapearDetalhe(
  item: EmbedItem,
  categoria: CategoriaConteudo
): ConteudoDetalhado {
  const resumo = mapearResumo(item, categoria);
  const castList = item.cast_crew?.cast || item.cast || [];
  const crewList = item.cast_crew?.crew || item.crew || [];
  const elenco = castList.slice(0, 12).map((c) => c.name).filter(Boolean);
  const diretor = crewList.find((c) => c.job === "Director")?.name;

  const seasonsApi = [...(item.seasons ?? [])].sort(
    (a, b) => (a.season_number ?? 0) - (b.season_number ?? 0)
  );

  let temporadas: Temporada[] | undefined;

  if (seasonsApi.length > 0) {
    temporadas = seasonsApi.map((s) => {
      const num = s.season_number ?? 0;
      const epsNaTemp = Math.max(0, Math.floor(s.episode_count || 0));
      const poster = s.poster || resumo.posterUrl;
      return {
        id: String(num),
        numero: num,
        titulo: s.name || (num === 0 ? "Especiais" : `Temporada ${num}`),
        totalEpisodios: epsNaTemp,
        posterUrl: poster,
        episodios: montarEpisodiosReais(num, epsNaTemp, poster),
      };
    });
  } else if (item.number_of_seasons && item.number_of_seasons > 0) {
    temporadas = Array.from(
      { length: item.number_of_seasons },
      (_, i) => {
        const num = i + 1;
        return {
          id: String(num),
          numero: num,
          titulo: `Temporada ${num}`,
          totalEpisodios: 0,
          posterUrl: resumo.posterUrl,
          episodios: [],
        };
      }
    );
  }

  return {
    ...resumo,
    descricao: item.plot || item.overview || "",
    duracaoMinutos: item.runtime,
    diretor,
    elenco,
    trailerUrl: item.trailer,
    totalTemporadas: temporadas?.filter((t) => t.numero > 0).length,
    temporadas,
    paisOrigem: item.production_countries?.[0] || "-",
    idiomaOriginal: item.original_language || resumo.idiomaOriginal || "-",
    classificacaoIndicativa: "-",
    semelhantes: [],
  };
}

export function mapearListaPaginada(
  data: EmbedListResponse,
  categoria: CategoriaConteudo
): ResultadoPaginado<ConteudoResumo> {
  const brutos = data.results ?? [];
  const validos = brutos.filter((item) => temIdValido(item));
  const visto = new Set<string>();
  const itens: ConteudoResumo[] = [];

  for (const item of validos) {
    const resumo = mapearResumo(item, categoria);
    const chave = chaveEstavel(resumo);
    if (visto.has(chave)) continue;
    visto.add(chave);
    itens.push(resumo);
  }

  const ordenados = [...itens].sort((a, b) => {
    const aPt = a.idiomaOriginal?.startsWith("pt") ? 1 : 0;
    const bPt = b.idiomaOriginal?.startsWith("pt") ? 1 : 0;
    return bPt - aPt;
  });

  return {
    itens: ordenados,
    paginaAtual: data.page ?? 1,
    totalPaginas: data.total_pages ?? 1,
    totalItens: data.total_results ?? ordenados.length,
    temProximaPagina: (data.page ?? 1) < (data.total_pages ?? 1),
  };
}

export { rotuloIdioma };
