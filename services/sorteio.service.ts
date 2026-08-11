import { ConteudoResumo } from "@/types";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedListResponse,
  EMPTY_EMBED_LIST,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";

const GENERO_PARA_QUERY: Record<string, string> = {
  acao: "action",
  drama: "drama",
  comedia: "comedy",
  terror: "horror",
  romance: "romance",
  "ficcao-cientifica": "science fiction",
  aventura: "adventure",
  suspense: "thriller",
  animacao: "animation",
  fantasia: "fantasy",
  crime: "crime",
  documentario: "documentary",
};

export type DuracaoSorteio = "curto" | "medio" | "longo" | "qualquer";

export interface OpcoesSorteio {
  generoId: string;
  anoMin?: number;
  anoMax?: number;
  notaMinima?: number;
  duracao?: DuracaoSorteio;
  quantidade?: number;
}

function idOk(item: ConteudoResumo): boolean {
  return Boolean(item.id) && !item.id.startsWith("tmp-");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Sorteia ate `quantidade` filmes (padrao 3) com filtros.
 * Duracao e aproximada: a listagem da API quase nao envia minutos,
 * entao usamos so como desempate leve quando existir.
 */
export async function sortearFilmes(
  opcoes: OpcoesSorteio
): Promise<ConteudoResumo[]> {
  const {
    generoId,
    anoMin = 1970,
    anoMax = new Date().getFullYear(),
    notaMinima = 0,
    duracao = "qualquer",
    quantidade = 3,
  } = opcoes;

  if (!API_HABILITADA) return [];

  const query = GENERO_PARA_QUERY[generoId] || generoId.replace(/-/g, " ");
  const candidatos: ConteudoResumo[] = [];
  const paginas = [1, 2, 3, Math.floor(Math.random() * 4) + 1];

  for (const page of paginas) {
    try {
      const data = await httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
        parametros: { q: query, page },
      });
      candidatos.push(...mapearListaPaginada(data, "filme").itens);
    } catch {
      /* pagina falhou */
    }
  }

  try {
    const trending = await httpClient<EmbedListResponse>(
      API_ROTAS.filmesTrending,
      { parametros: { time_window: "week", page: 1 } }
    );
    candidatos.push(...mapearListaPaginada(trending, "filme").itens);
  } catch {
    /* ignore */
  }

  const unicos = new Map<string, ConteudoResumo>();
  for (const item of candidatos) {
    if (idOk(item) && !unicos.has(item.id)) unicos.set(item.id, item);
  }

  let pool = [...unicos.values()].filter((i) => {
    if (i.ano > 0 && (i.ano < anoMin || i.ano > anoMax)) return false;
    if (notaMinima > 0 && (i.nota ?? 0) < notaMinima) return false;
    return true;
  });

  if (pool.length === 0) {
    pool = [...unicos.values()].filter(
      (i) => !notaMinima || (i.nota ?? 0) >= Math.max(0, notaMinima - 1)
    );
  }

  // duracao fica so na UI: ConteudoResumo nao traz minutos da listagem
  void duracao;

  return shuffle(pool).slice(0, quantidade);
}

/** @deprecated use sortearFilmes */
export async function sortearFilme(opcoes: {
  generoId: string;
  anoMin?: number;
  anoMax?: number;
}): Promise<ConteudoResumo | null> {
  const lista = await sortearFilmes({ ...opcoes, quantidade: 1 });
  return lista[0] ?? null;
}
