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
  EmbedListResponse, EMPTY_EMBED_LIST,
  mapearDetalhe,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";
import { filtrarAnimes } from "@/lib/adapters/filtros-categoria";

const VAZIO: ResultadoPaginado<ConteudoResumo> = {
  itens: [],
  paginaAtual: 1,
  totalPaginas: 1,
  totalItens: 0,
  temProximaPagina: false,
};

const BUSCAS_ANIME = [
  "anime",
  "naruto",
  "one piece",
  "attack on titan",
  "demon slayer",
  "jujutsu kaisen",
  "bleach",
  "dragon ball",
  "my hero academia",
  "death note",
];

export async function getAnimes(
  parametros: ParametrosListagem = {}
): Promise<ResultadoPaginado<ConteudoResumo>> {
  if (!API_HABILITADA) return VAZIO;
  try {
    const pagina = parametros.pagina ?? 1;
    const trending = await httpClient<EmbedListResponse>(
      API_ROTAS.seriesTrending,
      { parametros: { time_window: "week", page: pagina } }
    ).catch(() => EMPTY_EMBED_LIST);

    let itens = filtrarAnimes(trending.results ?? []);

    if (itens.length < 8) {
      const termo = BUSCAS_ANIME[(pagina - 1) % BUSCAS_ANIME.length]!;
      const busca = await httpClient<EmbedListResponse>(API_ROTAS.buscaSeries, {
        parametros: { q: termo, page: 1 },
      }).catch(() => EMPTY_EMBED_LIST);

      const extra = filtrarAnimes(busca.results ?? []);
      const ids = new Set(itens.map((i) => i.imdb_id || i.tmdb_id));
      for (const item of extra) {
        const key = item.imdb_id || item.tmdb_id;
        if (key && !ids.has(key)) {
          ids.add(key);
          itens.push(item);
        }
      }
    }

    return mapearListaPaginada(
      {
        page: pagina,
        total_pages: Math.max(trending.total_pages ?? 10, 10),
        total_results: trending.total_results ?? itens.length,
        results: itens,
      },
      "anime"
    );
  } catch (e) {
    console.error("[getAnimes]", e);
    return VAZIO;
  }
}

export async function getAnimePorId(
  id: string
): Promise<ConteudoDetalhado | null> {
  if (!API_HABILITADA) return null;
  try {
    const rota = id.startsWith("tt")
      ? API_ROTAS.seriePorImdb(id)
      : API_ROTAS.seriePorTmdb(id);
    const item = await httpClient<EmbedItem>(rota);
    if (!item || (!item.name && !item.tmdb_id && !item.imdb_id)) return null;
    return mapearDetalhe(item, "anime");
  } catch {
    return null;
  }
}
