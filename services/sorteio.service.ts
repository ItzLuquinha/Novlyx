import { ConteudoResumo } from "@/types";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedListResponse,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";

/**
 * Query simples (a API de search trata frase longa como titulo).
 * Keywords so reforçam quando o item traz generos preenchidos.
 */
const GENERO_CFG: Record<string, { queries: string[]; keywords: string[] }> = {
  acao: {
    queries: ["action"],
    keywords: ["action", "acao", "ação"],
  },
  drama: {
    queries: ["drama"],
    keywords: ["drama"],
  },
  comedia: {
    queries: ["comedy"],
    keywords: ["comedy", "comedia", "comédia"],
  },
  terror: {
    queries: ["horror"],
    keywords: ["horror", "terror"],
  },
  romance: {
    queries: ["romance"],
    keywords: ["romance", "romantic"],
  },
  "ficcao-cientifica": {
    queries: ["sci-fi", "science"],
    keywords: ["science fiction", "sci-fi", "scifi", "ficcao", "ficção"],
  },
  aventura: {
    queries: ["adventure"],
    keywords: ["adventure", "aventura"],
  },
  suspense: {
    queries: ["thriller"],
    keywords: ["thriller", "suspense", "mystery"],
  },
  animacao: {
    queries: ["animation"],
    keywords: ["animation", "animated", "animacao", "animação"],
  },
  fantasia: {
    queries: ["fantasy"],
    keywords: ["fantasy", "fantasia"],
  },
  crime: {
    queries: ["crime"],
    keywords: ["crime"],
  },
  documentario: {
    queries: ["documentary"],
    keywords: ["documentary", "documentario", "documentário"],
  },
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
  return Boolean(item.id) && !item.id.startsWith("tmp-") && !item.id.startsWith("nome-");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function textoGeneros(item: ConteudoResumo): string {
  return (item.generos ?? []).map((g) => g.nome.toLowerCase()).join(" ");
}

/**
 * Se o item nao tem generos, confia na busca.
 * Se tem, exige pelo menos uma keyword.
 */
function passaGenero(item: ConteudoResumo, keywords: string[]): boolean {
  if (!keywords.length) return true;
  const nomes = textoGeneros(item);
  if (!nomes.trim()) return true;
  return keywords.some((k) => nomes.includes(k.toLowerCase()));
}

function passaAno(item: ConteudoResumo, anoMin: number, anoMax: number): boolean {
  if (!item.ano || item.ano <= 0) return true;
  return item.ano >= anoMin && item.ano <= anoMax;
}

function passaNota(item: ConteudoResumo, notaMinima: number): boolean {
  if (notaMinima <= 0) return true;
  return (item.nota ?? 0) >= notaMinima;
}

async function buscarPaginas(
  queries: string[],
  paginas: number[]
): Promise<ConteudoResumo[]> {
  const tarefas: Promise<ConteudoResumo[]>[] = [];

  for (const q of queries) {
    for (const page of paginas) {
      tarefas.push(
        httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
          parametros: { q, page },
        })
          .then((data) => mapearListaPaginada(data, "filme").itens)
          .catch(() => [] as ConteudoResumo[])
      );
    }
  }

  const lotes = await Promise.all(tarefas);
  return lotes.flat();
}

export async function sortearFilmes(
  opcoes: OpcoesSorteio
): Promise<ConteudoResumo[]> {
  const {
    generoId,
    anoMin = 1970,
    anoMax = new Date().getFullYear(),
    notaMinima = 0,
    quantidade = 3,
  } = opcoes;

  if (!API_HABILITADA) return [];

  const cfg = GENERO_CFG[generoId] ?? {
    queries: [generoId.replace(/-/g, " ")],
    keywords: [generoId.replace(/-/g, " ")],
  };

  // Paginas aleatorias para variar o "sortear de novo"
  const basePages = [1, 2, 3];
  const extra = Math.floor(Math.random() * 5) + 1;
  const paginas = [...new Set([...basePages, extra, extra + 1])];

  const candidatos = await buscarPaginas(cfg.queries, paginas);

  const unicos = new Map<string, ConteudoResumo>();
  for (const item of candidatos) {
    if (idOk(item) && !unicos.has(item.id)) {
      unicos.set(item.id, item);
    }
  }

  const lista = [...unicos.values()];

  // 1) filtro completo
  let pool = lista.filter(
    (i) =>
      passaGenero(i, cfg.keywords) &&
      passaAno(i, anoMin, anoMax) &&
      passaNota(i, notaMinima)
  );

  // 2) afrouxa nota (-1)
  if (pool.length < quantidade && notaMinima > 0) {
    pool = lista.filter(
      (i) =>
        passaGenero(i, cfg.keywords) &&
        passaAno(i, anoMin, anoMax) &&
        passaNota(i, Math.max(0, notaMinima - 1))
    );
  }

  // 3) so genero + nota (ignora epoca)
  if (pool.length < quantidade) {
    pool = lista.filter(
      (i) => passaGenero(i, cfg.keywords) && passaNota(i, Math.min(notaMinima, 6))
    );
  }

  // 4) so genero (ou confia na busca)
  if (pool.length < quantidade) {
    pool = lista.filter((i) => passaGenero(i, cfg.keywords));
  }

  // 5) qualquer candidato valido da busca
  if (pool.length < quantidade) {
    pool = lista;
  }

  return shuffle(pool).slice(0, quantidade);
}

export async function sortearFilme(opcoes: {
  generoId: string;
  anoMin?: number;
  anoMax?: number;
}): Promise<ConteudoResumo | null> {
  const lista = await sortearFilmes({ ...opcoes, quantidade: 1 });
  return lista[0] ?? null;
}
