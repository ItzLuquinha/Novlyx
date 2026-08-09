import { CategoriaConteudo, ConteudoResumo } from "@/types";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedListResponse,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";

function ehSerieLike(cat: CategoriaConteudo): boolean {
  return cat === "serie" || cat === "anime" || cat === "dorama";
}

/**
 * Busca títulos parecidos com base no ID (IMDb tt… ou TMDB).
 */
export async function getSimilaresPorId(
  id: string,
  categoria: CategoriaConteudo,
  limite = 20
): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA || !id) return [];

  try {
    const serie = ehSerieLike(categoria);
    const parametros = id.startsWith("tt")
      ? { imdb_id: id }
      : { tmdb_id: id };

    const data = await httpClient<EmbedListResponse>(
      serie ? API_ROTAS.similaresSeries : API_ROTAS.similaresFilmes,
      { parametros }
    );

    const catMap: CategoriaConteudo = serie ? "serie" : "filme";
    const itens = mapearListaPaginada(data, catMap).itens.filter(
      (i) => i.id !== id
    );
    return itens.slice(0, limite);
  } catch (e) {
    console.error("[getSimilaresPorId]", e);
    return [];
  }
}

/**
 * Fallback: busca pelo nome do título.
 */
export async function getSimilaresPorTitulo(
  titulo: string,
  categoria: CategoriaConteudo,
  limite = 20
): Promise<ConteudoResumo[]> {
  if (!API_HABILITADA || !titulo.trim()) return [];
  try {
    const serie = ehSerieLike(categoria);
    // pega palavras principais do título
    const q = titulo
      .replace(/\([^)]*\)/g, "")
      .split(/[:\-]/)[0]
      ?.trim()
      .slice(0, 40) || titulo;

    const data = await httpClient<EmbedListResponse>(
      serie ? API_ROTAS.buscaSeries : API_ROTAS.buscaFilmes,
      { parametros: { q, page: 1 } }
    );
    const catMap: CategoriaConteudo = serie ? "serie" : "filme";
    return mapearListaPaginada(data, catMap)
      .itens.filter(
        (i) => i.titulo.toLowerCase() !== titulo.toLowerCase()
      )
      .slice(0, limite);
  } catch (e) {
    console.error("[getSimilaresPorTitulo]", e);
    return [];
  }
}

export async function getRecomendacoesPorHistorico(
  base: {
    conteudoId: string;
    categoria: CategoriaConteudo;
    titulo: string;
  },
  limite = 20
): Promise<ConteudoResumo[]> {
  const porId = await getSimilaresPorId(
    base.conteudoId,
    base.categoria,
    limite
  );
  if (porId.length >= 6) return porId;

  const porTitulo = await getSimilaresPorTitulo(
    base.titulo,
    base.categoria,
    limite
  );

  const visto = new Set(porId.map((i) => i.id));
  const mix = [...porId];
  for (const item of porTitulo) {
    if (!visto.has(item.id) && item.id !== base.conteudoId) {
      visto.add(item.id);
      mix.push(item);
    }
  }
  return mix.slice(0, limite);
}
