import {
  ConteudoDetalhado,
  ConteudoResumo,
  ParametrosListagem,
  ResultadoPaginado,
} from "@/types";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedItem,
  EmbedListResponse,
  mapearDetalhe,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";
import { filtrarSeries } from "@/lib/adapters/filtros-categoria";

const VAZIO: ResultadoPaginado<ConteudoResumo> = {
  itens: [],
  paginaAtual: 1,
  totalPaginas: 1,
  totalItens: 0,
  temProximaPagina: false,
};

export async function getSeries(
  parametros: ParametrosListagem = {}
): Promise<ResultadoPaginado<ConteudoResumo>> {
  if (!API_HABILITADA) return VAZIO;
  try {
    const pagina = parametros.pagina ?? 1;
    let data: EmbedListResponse;
    if (parametros.generoId) {
      const q = parametros.generoId.replace(/-/g, " ");
      data = await httpClient<EmbedListResponse>(API_ROTAS.buscaSeries, {
        parametros: { q, page: pagina },
      });
    } else {
      data = await httpClient<EmbedListResponse>(API_ROTAS.seriesTrending, {
        parametros: { time_window: "week", page: pagina },
      });
    }
    const filtrados = filtrarSeries(data.results ?? []);
    let resultado = mapearListaPaginada({ ...data, results: filtrados }, "serie");
    if (parametros.ordenarPor === "melhorAvaliados" || parametros.ordenarPor === "populares") {
      resultado = { ...resultado, itens: [...resultado.itens].sort((a, b) => b.nota - a.nota) };
    } else if (parametros.ordenarPor === "alfabetica") {
      resultado = { ...resultado, itens: [...resultado.itens].sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR")) };
    } else if (parametros.ordenarPor === "ano") {
      resultado = { ...resultado, itens: [...resultado.itens].sort((a, b) => b.ano - a.ano) };
    }
    return resultado;
  } catch (e) {
    console.error("[getSeries]", e);
    return VAZIO;
  }
}

export async function getSeriePorId(
  id: string
): Promise<ConteudoDetalhado | null> {
  if (!API_HABILITADA) return null;
  try {
    const rota = id.startsWith("tt")
      ? API_ROTAS.seriePorImdb(id)
      : API_ROTAS.seriePorTmdb(id);

    const item = await httpClient<EmbedItem>(rota);
    if (!item || (!item.name && !item.tmdb_id && !item.imdb_id)) {
      return null;
    }
    return mapearDetalhe(item, "serie");
  } catch {
    return null;
  }
}
