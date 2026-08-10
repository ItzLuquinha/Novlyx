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
import { filtrarDoramas } from "@/lib/adapters/filtros-categoria";

const VAZIO: ResultadoPaginado<ConteudoResumo> = {
  itens: [],
  paginaAtual: 1,
  totalPaginas: 1,
  totalItens: 0,
  temProximaPagina: false,
};

const BUSCAS_DORAMA = [
  "squid game",
  "korean drama",
  "crash landing on you",
  "goblin",
  "itaewon class",
  "business proposal",
  "queen of tears",
  "the glory",
  "chinese drama",
  "thai drama",
];

export async function getDoramas(
  parametros: ParametrosListagem = {}
): Promise<ResultadoPaginado<ConteudoResumo>> {
  if (!API_HABILITADA) return VAZIO;
  try {
    const pagina = parametros.pagina ?? 1;
    const trending = await httpClient<EmbedListResponse>(
      API_ROTAS.seriesTrending,
      { parametros: { time_window: "week", page: pagina } }
    ).catch(() => EMPTY_EMBED_LIST);

    let itens = filtrarDoramas(trending.results ?? []);

    if (itens.length < 8) {
      const termo = BUSCAS_DORAMA[(pagina - 1) % BUSCAS_DORAMA.length]!;
      const busca = await httpClient<EmbedListResponse>(API_ROTAS.buscaSeries, {
        parametros: { q: termo, page: 1 },
      }).catch(() => EMPTY_EMBED_LIST);

      const extra = filtrarDoramas(busca.results ?? []);
      const pool =
        extra.length > 0
          ? extra
          : (busca.results ?? []).filter((i) => {
              const lang = (i.original_language || "").toLowerCase();
              return ["ko", "korean", "zh", "th", "ja"].some((l) =>
                lang.includes(l)
              );
            });

      const ids = new Set(itens.map((i) => i.imdb_id || i.tmdb_id));
      for (const item of pool) {
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
      "dorama"
    );
  } catch (e) {
    console.error("[getDoramas]", e);
    return VAZIO;
  }
}

export async function getDoramaPorId(
  id: string
): Promise<ConteudoDetalhado | null> {
  if (!API_HABILITADA) return null;
  try {
    const rota = id.startsWith("tt")
      ? API_ROTAS.seriePorImdb(id)
      : API_ROTAS.seriePorTmdb(id);
    const item = await httpClient<EmbedItem>(rota);
    if (!item || (!item.name && !item.tmdb_id && !item.imdb_id)) return null;
    return mapearDetalhe(item, "dorama");
  } catch {
    return null;
  }
}
