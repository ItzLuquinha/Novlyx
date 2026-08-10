import { ResultadoBusca } from "@/types";
import { CANAIS, EVENTOS_ESPORTIVOS } from "@/lib/mock-data";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedListResponse, EMPTY_EMBED_LIST,
  mapearResumo,
  temIdValido,
} from "@/lib/adapters/2embed";

export async function pesquisarConteudo(query: string): Promise<ResultadoBusca> {
  const vazio: ResultadoBusca = {
    filmes: [],
    series: [],
    animes: [],
    doramas: [],
    canais: [],
    eventos: [],
  };

  if (!query.trim()) return vazio;

  if (API_HABILITADA) {
    const [filmesData, seriesData] = await Promise.all([
      httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
        parametros: { q: query, page: 1 },
      }).catch(() => EMPTY_EMBED_LIST),
      httpClient<EmbedListResponse>(API_ROTAS.buscaSeries, {
        parametros: { q: query, page: 1 },
      }).catch(() => EMPTY_EMBED_LIST),
    ]);

    const filmes = (filmesData.results ?? [])
      .filter(temIdValido)
      .map((i) => mapearResumo(i, "filme"));
    const series = (seriesData.results ?? [])
      .filter(temIdValido)
      .map((i) => mapearResumo(i, "serie"));

    return {
      filmes,
      series,
      animes: [],
      doramas: [],
      canais: [],
      eventos: [],
    };
  }

  // Sem API: só canais/eventos mock locais (se houver)
  const termo = query.trim().toLowerCase();
  return {
    filmes: [],
    series: [],
    animes: [],
    doramas: [],
    canais: CANAIS.filter((c) => c.nome.toLowerCase().includes(termo)),
    eventos: EVENTOS_ESPORTIVOS.filter((e) =>
      e.titulo.toLowerCase().includes(termo)
    ),
  };
}
