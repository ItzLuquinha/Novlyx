import { CategoriaConteudo, ConteudoDetalhado, ConteudoResumo } from "@/types";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import { httpClient } from "@/lib/http-client";
import { getFilmePorId } from "./filmes.service";
import { getSeriePorId } from "./series.service";
import { getAnimePorId } from "./animes.service";
import { getDoramaPorId } from "./doramas.service";
import {
  EmbedListResponse, EMPTY_EMBED_LIST,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";

export async function getConteudoPorId(
  id: string
): Promise<ConteudoDetalhado | null> {
  const idLimpo = decodeURIComponent(id).trim();
  if (!idLimpo || idLimpo.startsWith("tmp-")) return null;
  if (!API_HABILITADA) return null;

  const [filme, serie] = await Promise.all([
    getFilmePorId(idLimpo).catch(() => null),
    getSeriePorId(idLimpo).catch(() => null),
  ]);

  if (filme) return filme;
  if (serie) return serie;

  const [anime, dorama] = await Promise.all([
    getAnimePorId(idLimpo).catch(() => null),
    getDoramaPorId(idLimpo).catch(() => null),
  ]);

  return anime ?? dorama ?? null;
}

async function trendingFilmes(limite: number): Promise<ConteudoResumo[]> {
  const data = await httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
    parametros: { time_window: "week", page: 1 },
  });
  return mapearListaPaginada(data, "filme").itens.slice(0, limite);
}

async function trendingSeries(limite: number): Promise<ConteudoResumo[]> {
  const data = await httpClient<EmbedListResponse>(API_ROTAS.seriesTrending, {
    parametros: { time_window: "week", page: 1 },
  });
  return mapearListaPaginada(data, "serie").itens.slice(0, limite);
}

async function mixTrending(limite: number): Promise<ConteudoResumo[]> {
  const [filmes, series] = await Promise.all([
    trendingFilmes(Math.ceil(limite / 2) + 5).catch(() => [] as ConteudoResumo[]),
    trendingSeries(Math.ceil(limite / 2) + 5).catch(() => [] as ConteudoResumo[]),
  ]);
  const mix = [...filmes, ...series].sort((a, b) => b.nota - a.nota);
  const visto = new Set<string>();
  const unicos: ConteudoResumo[] = [];
  for (const item of mix) {
    if (!visto.has(item.id)) {
      visto.add(item.id);
      unicos.push(item);
    }
  }
  return unicos.slice(0, limite);
}

export async function getEmAlta(limite = 20): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    return await mixTrending(limite);
  } catch (e) {
    console.error("[getEmAlta]", e);
    return [];
  }
}

export async function getLancamentos(limite = 20): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    const data = await httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
      parametros: { time_window: "day", page: 1 },
    });
    return mapearListaPaginada(data, "filme").itens.slice(0, limite);
  } catch (e) {
    console.error("[getLancamentos]", e);
    return [];
  }
}

export async function getMaisPopulares(limite = 20): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    return await mixTrending(limite);
  } catch (e) {
    console.error("[getMaisPopulares]", e);
    return [];
  }
}

export async function getRecomendados(limite = 20): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    const data = await httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
      parametros: { time_window: "week", page: 2 },
    });
    return mapearListaPaginada(data, "filme").itens.slice(0, limite);
  } catch (e) {
    console.error("[getRecomendados]", e);
    return [];
  }
}

export async function getAdicionadosRecentemente(
  limite = 20
): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    const data = await httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
      parametros: { time_window: "day", page: 1 },
    });
    return mapearListaPaginada(data, "filme").itens.slice(0, limite);
  } catch (e) {
    console.error("[getAdicionadosRecentemente]", e);
    return [];
  }
}

export async function getPorGenero(
  generoId: string,
  limite = 20
): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    const data = await httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
      parametros: { q: generoId.replace(/-/g, " "), page: 1 },
    });
    const itens = mapearListaPaginada(data, "filme").itens;
    if (itens.length > 0) return itens.slice(0, limite);
    return await trendingFilmes(limite);
  } catch (e) {
    console.error("[getPorGenero]", e);
    return [];
  }
}

export async function getDestaquesBanner(
  limite = 6
): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    return await mixTrending(limite);
  } catch (e) {
    console.error("[getDestaquesBanner]", e);
    return [];
  }
}

export async function getTrendingBR(limite = 20): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    const termos = ["brasileiro", "cinema nacional", "globo", "netflix brasil", "série brasileira"];
    const termo = termos[Math.floor(Math.random() * termos.length)]!;
    const [busca, trending] = await Promise.all([
      httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
        parametros: { q: termo, page: 1 },
      }).catch(() => EMPTY_EMBED_LIST),
      httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
        parametros: { time_window: "week", page: 1 },
      }).catch(() => EMPTY_EMBED_LIST),
    ]);
    const a = mapearListaPaginada(busca as EmbedListResponse, "filme").itens;
    const b = mapearListaPaginada(trending as EmbedListResponse, "filme").itens;
    
    const mix = [...a, ...b].sort((x, y) => {
      const xp = x.idiomaOriginal?.startsWith("pt") ? 1 : 0;
      const yp = y.idiomaOriginal?.startsWith("pt") ? 1 : 0;
      return yp - xp || y.nota - x.nota;
    });
    const visto = new Set<string>();
    const out: ConteudoResumo[] = [];
    for (const item of mix) {
      if (!visto.has(item.id)) {
        visto.add(item.id);
        out.push(item);
      }
    }
    return out.slice(0, limite);
  } catch (e) {
    console.error("[getTrendingBR]", e);
    return [];
  }
}

export async function getLancamentosDaSemana(
  limite = 20
): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA) return [];
  try {
    const ano = new Date().getFullYear();
    const data = await httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
      parametros: { time_window: "day", page: 1 },
    });
    let itens = mapearListaPaginada(data, "filme").itens;
    const recentes = itens.filter((i) => i.ano >= ano - 1);
    if (recentes.length >= 6) itens = recentes;
    return itens.slice(0, limite);
  } catch (e) {
    console.error("[getLancamentosDaSemana]", e);
    return [];
  }
}
