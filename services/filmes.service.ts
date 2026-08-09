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
import { filtrarFilmes } from "@/lib/adapters/filtros-categoria";

const VAZIO: ResultadoPaginado<ConteudoResumo> = {
  itens: [],
  paginaAtual: 1,
  totalPaginas: 1,
  totalItens: 0,
  temProximaPagina: false,
};

const GENERO_QUERY: Record<string, string> = {
  acao: "action",
  drama: "drama",
  comedia: "comedy",
  terror: "horror",
  romance: "romance",
  "ficcao-cientifica": "science fiction",
  documentario: "documentary",
  aventura: "adventure",
  suspense: "thriller",
  animacao: "animation",
  fantasia: "fantasy",
  crime: "crime",
};

export async function getFilmes(
  parametros: ParametrosListagem = {}
): Promise<ResultadoPaginado<ConteudoResumo>> {
  if (!API_HABILITADA) return VAZIO;
  try {
    const pagina = parametros.pagina ?? 1;
    const generoId = parametros.generoId;

    let data: EmbedListResponse;
    if (generoId) {
      const q = GENERO_QUERY[generoId] || generoId.replace(/-/g, " ");
      data = await httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
        parametros: { q, page: pagina },
      });
    } else {
      data = await httpClient<EmbedListResponse>(API_ROTAS.filmesTrending, {
        parametros: { time_window: "week", page: pagina },
      });
    }

    const filtrados = filtrarFilmes(data.results ?? []);
    let resultado = mapearListaPaginada({ ...data, results: filtrados }, "filme");

    if (parametros.ordenarPor === "melhorAvaliados" || parametros.ordenarPor === "populares") {
      resultado = {
        ...resultado,
        itens: [...resultado.itens].sort((a, b) => b.nota - a.nota),
      };
    } else if (parametros.ordenarPor === "alfabetica") {
      resultado = {
        ...resultado,
        itens: [...resultado.itens].sort((a, b) =>
          a.titulo.localeCompare(b.titulo, "pt-BR")
        ),
      };
    } else if (parametros.ordenarPor === "recentes") {
      resultado = {
        ...resultado,
        itens: [...resultado.itens].sort((a, b) => b.ano - a.ano),
      };
    }

    return resultado;
  } catch (e) {
    console.error("[getFilmes]", e);
    return VAZIO;
  }
}

export async function getFilmePorId(
  id: string
): Promise<ConteudoDetalhado | null> {
  if (!API_HABILITADA) return null;
  try {
    const rota = id.startsWith("tt")
      ? API_ROTAS.filmePorImdb(id)
      : API_ROTAS.filmePorTmdb(id);

    const item = await httpClient<EmbedItem>(rota);
    if (!item || (!item.title && !item.tmdb_id && !item.imdb_id)) {
      return null;
    }
    return mapearDetalhe(item, "filme");
  } catch {
    return null;
  }
}
