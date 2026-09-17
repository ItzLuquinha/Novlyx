import type { CategoriaConteudo, ConteudoResumo } from "@/types";

export const CATEGORIAS_CONTEUDO: CategoriaConteudo[] = [
  "filme",
  "serie",
  "anime",
  "dorama",
];

export function ehCategoriaValida(
  valor: string | undefined | null
): valor is CategoriaConteudo {
  return (
    valor === "filme" ||
    valor === "serie" ||
    valor === "anime" ||
    valor === "dorama"
  );
}

export function ehSerieLike(categoria: CategoriaConteudo): boolean {
  return categoria === "serie" || categoria === "anime" || categoria === "dorama";
}

export type TipoIdExterno = "tmdb" | "imdb" | "interno";

export interface IdentidadeConteudo {
  idInterno: string;
  categoria: CategoriaConteudo;
  tmdbId?: string;
  imdbId?: string;
  tipoId: TipoIdExterno;
}

export function normalizarImdb(id?: string | null): string | undefined {
  if (!id) return undefined;
  const limpo = id.trim();
  if (/^tt\d{5,12}$/i.test(limpo)) return limpo.toLowerCase();
  return undefined;
}

export function normalizarTmdb(
  id?: string | number | null
): string | undefined {
  if (id == null || id === "") return undefined;
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) return undefined;
  return String(n);
}

export function montarIdInterno(
  categoria: CategoriaConteudo,
  tmdbId?: string,
  imdbId?: string,
  fallbackInterno?: string
): string {
  const tmdb = normalizarTmdb(tmdbId);
  if (tmdb) return `${categoria}:tmdb:${tmdb}`;
  const imdb = normalizarImdb(imdbId);
  if (imdb) return `${categoria}:imdb:${imdb}`;
  const interno = (fallbackInterno || "desconhecido")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${categoria}:interno:${interno || "desconhecido"}`;
}

/** Só interpreta o formato `categoria:tipo:valor`. IDs soltos não assumem filme. */
export function parseIdInterno(
  valor: string | null | undefined
): IdentidadeConteudo | null {
  if (!valor) return null;
  const bruto = decodeURIComponent(valor).trim();
  const partes = bruto.split(":");
  if (partes.length < 3 || !ehCategoriaValida(partes[0])) return null;
  const categoria = partes[0];
  const tipo = partes[1];
  const resto = partes.slice(2).join(":");
  if (tipo === "tmdb") {
    const tmdbId = normalizarTmdb(resto);
    if (!tmdbId) return null;
    return {
      idInterno: `${categoria}:tmdb:${tmdbId}`,
      categoria,
      tmdbId,
      tipoId: "tmdb",
    };
  }
  if (tipo === "imdb") {
    const imdbId = normalizarImdb(resto);
    if (!imdbId) return null;
    return {
      idInterno: `${categoria}:imdb:${imdbId}`,
      categoria,
      imdbId,
      tipoId: "imdb",
    };
  }
  if (tipo === "interno") {
    return {
      idInterno: `${categoria}:interno:${resto}`,
      categoria,
      tipoId: "interno",
    };
  }
  return null;
}

/** IDs seguros para consultar a API externa. Nunca envia nome-* nem idInterno cru. */
export function idsParaConsulta(id: string): {
  imdbId?: string;
  tmdbId?: string;
  categoria?: CategoriaConteudo;
  tipoId: TipoIdExterno | "desconhecido";
} {
  const parsed = parseIdInterno(id);
  if (parsed) {
    if (parsed.tipoId === "interno") {
      return { categoria: parsed.categoria, tipoId: "interno" };
    }
    return {
      imdbId: parsed.imdbId,
      tmdbId: parsed.tmdbId,
      categoria: parsed.categoria,
      tipoId: parsed.tipoId,
    };
  }
  const imdb = normalizarImdb(id);
  if (imdb) return { imdbId: imdb, tipoId: "imdb" };
  const tmdb = normalizarTmdb(id);
  if (tmdb) return { tmdbId: tmdb, tipoId: "tmdb" };
  return { tipoId: "desconhecido" };
}

export function temIdExterno(item: {
  tmdbId?: string;
  imdbId?: string;
}): boolean {
  return Boolean(normalizarTmdb(item.tmdbId) || normalizarImdb(item.imdbId));
}

export function chaveEstavel(item: {
  categoria: CategoriaConteudo;
  tmdbId?: string;
  imdbId?: string;
  idInterno?: string;
  id?: string;
}): string {
  const tmdb = normalizarTmdb(item.tmdbId);
  if (tmdb) return `${item.categoria}:tmdb:${tmdb}`;
  const imdb = normalizarImdb(item.imdbId);
  if (imdb) return `${item.categoria}:imdb:${imdb}`;
  return item.idInterno || item.id || `${item.categoria}:desconhecido`;
}

export function chaveProgresso(
  categoria: CategoriaConteudo,
  idInterno: string,
  season?: number,
  episode?: number
): string {
  if (ehSerieLike(categoria) && season && episode) {
    return `${categoria}:${idInterno}:S${season}:E${episode}`;
  }
  return `${categoria}:${idInterno}`;
}

export function slugRota(item: {
  categoria: CategoriaConteudo;
  tmdbId?: string;
  imdbId?: string;
  idInterno?: string;
  id?: string;
}): { categoria: CategoriaConteudo; id: string } {
  const tmdb = normalizarTmdb(item.tmdbId);
  const imdb = normalizarImdb(item.imdbId);
  const id = tmdb || imdb || item.idInterno || item.id || "";
  return { categoria: item.categoria, id };
}

export function hrefConteudo(item: {
  categoria: CategoriaConteudo;
  tmdbId?: string;
  imdbId?: string;
  idInterno?: string;
  id?: string;
}): string {
  const { categoria, id } = slugRota(item);
  if (!id) return "/";
  return `/conteudo/${categoria}/${encodeURIComponent(id)}`;
}

export function hrefPlayer(
  item: {
    categoria: CategoriaConteudo;
    tmdbId?: string;
    imdbId?: string;
    idInterno?: string;
    id?: string;
  },
  season?: number,
  episode?: number
): string {
  const { categoria, id } = slugRota(item);
  if (!id) return "/";
  const base = `/player/${categoria}/${encodeURIComponent(id)}`;
  if (ehSerieLike(item.categoria) && season && episode) {
    return `${base}?s=${season}&e=${episode}&temporada=${season}&episodio=${episode}`;
  }
  return base;
}

export function hrefPlayerDeIds(
  categoria: CategoriaConteudo,
  conteudoId: string,
  season?: number,
  episode?: number
): string {
  const ids = idsParaConsulta(conteudoId);
  const id = ids.tmdbId || ids.imdbId || conteudoId;
  const cat =
    ids.categoria && ehCategoriaValida(ids.categoria)
      ? ids.categoria
      : categoria;
  const base = `/player/${cat}/${encodeURIComponent(id)}`;
  if (ehSerieLike(cat) && season && episode) {
    return `${base}?s=${season}&e=${episode}&temporada=${season}&episodio=${episode}`;
  }
  return base;
}

export function hrefConteudoDeIds(
  categoria: CategoriaConteudo,
  conteudoId: string
): string {
  const ids = idsParaConsulta(conteudoId);
  const id = ids.tmdbId || ids.imdbId || conteudoId;
  const cat =
    ids.categoria && ehCategoriaValida(ids.categoria)
      ? ids.categoria
      : categoria;
  return `/conteudo/${cat}/${encodeURIComponent(id)}`;
}

export function idsDeResumo(item: ConteudoResumo): {
  tmdbId?: string;
  imdbId?: string;
  idInterno: string;
} {
  return {
    tmdbId: normalizarTmdb(item.tmdbId),
    imdbId: normalizarImdb(item.imdbId),
    idInterno: item.idInterno || item.id,
  };
}

export function debugDev(tag: string, payload: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") return;
  console.debug(tag, payload);
}
