import {
  CategoriaConteudo,
  ConteudoDetalhado,
  ConteudoResumo,
  Genero,
  QualidadeVideo,
  ResultadoPaginado,
} from "@/types";
import { tituloEmPortugues } from "@/lib/titulos-pt";

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

function idDe(item: EmbedItem): string {
  const imdb = item.imdb_id?.trim();
  if (imdb && imdb.startsWith("tt")) return imdb;
  if (item.tmdb_id != null && Number(item.tmdb_id) > 0) {
    return String(item.tmdb_id);
  }
  
  const nome = (item.title || item.name || "").trim();
  if (nome) {
    const ano = item.year || item.release_date?.slice(0, 4) || "";
    return `nome-${nome.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${ano}`;
  }
  return "";
}

export function temIdValido(item: EmbedItem): boolean {
  return Boolean(idDe(item));
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

  return {
    id: idDe(item),
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
  const castList =
    item.cast_crew?.cast ||
    item.cast ||
    [];
  const crewList = item.cast_crew?.crew || item.crew || [];
  const elenco = castList.slice(0, 12).map((c) => c.name).filter(Boolean);
  const diretor = crewList.find((c) => c.job === "Director")?.name;

  const totalTemp = item.number_of_seasons || 0;
  const totalEps = item.number_of_episodes || 0;
  
  const temporadas =
    totalTemp > 0
      ? Array.from({ length: Math.min(totalTemp, 30) }, (_, i) => {
          const num = i + 1;
          const epsNaTemp =
            totalTemp > 0
              ? Math.max(1, Math.ceil(totalEps / totalTemp) || 12)
              : 12;
          return {
            id: String(num),
            numero: num,
            titulo: `Temporada ${num}`,
            totalEpisodios: epsNaTemp,
            posterUrl: resumo.posterUrl,
            episodios: Array.from({ length: Math.min(epsNaTemp, 40) }, (_, j) => {
              const ep = j + 1;
              return {
                id: String(ep),
                numero: ep,
                temporadaId: String(num),
                titulo: `Episódio ${ep}`,
                descricao: "",
                duracaoMinutos: 45,
                posterUrl: resumo.posterUrl,
                dataLancamento: "",
              };
            }),
          };
        })
      : undefined;

  return {
    ...resumo,
    descricao: item.plot || item.overview || "",
    duracaoMinutos: item.runtime,
    diretor,
    elenco,
    trailerUrl: item.trailer,
    totalTemporadas: totalTemp || undefined,
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
  let validos = brutos.filter((item) => temIdValido(item));
  
  if (validos.length === 0 && brutos.length > 0) {
    validos = brutos;
  }
  let itens = validos.map((item) => mapearResumo(item, categoria)).filter((i) => Boolean(i.id));

  
  itens = [...itens].sort((a, b) => {
    const aPt = a.idiomaOriginal?.startsWith("pt") ? 1 : 0;
    const bPt = b.idiomaOriginal?.startsWith("pt") ? 1 : 0;
    return bPt - aPt;
  });

  return {
    itens,
    paginaAtual: data.page ?? 1,
    totalPaginas: data.total_pages ?? 1,
    totalItens: data.total_results ?? itens.length,
    temProximaPagina: (data.page ?? 1) < (data.total_pages ?? 1),
  };
}

export { rotuloIdioma };
