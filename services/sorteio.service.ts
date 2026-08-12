import { ConteudoResumo } from "@/types";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedListResponse,
  mapearListaPaginada,
} from "@/lib/adapters/2embed";

/** Query de busca + palavras que o genero deve bater nos generos do item */
const GENERO_CFG: Record<
  string,
  { query: string; keywords: string[] }
> = {
  acao: {
    query: "action movie",
    keywords: ["action", "acao", "ação", "martial", "superhero"],
  },
  drama: {
    query: "drama movie",
    keywords: ["drama"],
  },
  comedia: {
    query: "comedy movie",
    keywords: ["comedy", "comedia", "comédia", "humor"],
  },
  terror: {
    query: "horror movie",
    keywords: ["horror", "terror", "slasher", "supernatural"],
  },
  romance: {
    query: "romance movie",
    keywords: ["romance", "romantic"],
  },
  "ficcao-cientifica": {
    query: "science fiction movie",
    keywords: ["science fiction", "sci-fi", "scifi", "ficcao", "ficção"],
  },
  aventura: {
    query: "adventure movie",
    keywords: ["adventure", "aventura"],
  },
  suspense: {
    query: "thriller movie",
    keywords: ["thriller", "suspense", "mystery"],
  },
  animacao: {
    query: "animation movie",
    keywords: ["animation", "animated", "animacao", "animação", "anime"],
  },
  fantasia: {
    query: "fantasy movie",
    keywords: ["fantasy", "fantasia"],
  },
  crime: {
    query: "crime movie",
    keywords: ["crime", "gangster"],
  },
  documentario: {
    query: "documentary movie",
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

function pertenceAoGenero(item: ConteudoResumo, keywords: string[]): boolean {
  if (!keywords.length) return true;
  const nomes = (item.generos ?? [])
    .map((g) => g.nome.toLowerCase())
    .join(" ");
  if (!nomes.trim()) {
    // sem genero na API: nao confiar (evita homem-aranha em terror)
    return false;
  }
  return keywords.some((k) => nomes.includes(k.toLowerCase()));
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
    query: generoId.replace(/-/g, " "),
    keywords: [generoId.replace(/-/g, " ")],
  };

  const candidatos: ConteudoResumo[] = [];
  const paginas = [1, 2, 3, 4, 5];

  for (const page of paginas) {
    try {
      const data = await httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
        parametros: { q: cfg.query, page },
      });
      candidatos.push(...mapearListaPaginada(data, "filme").itens);
    } catch {
      /* pagina falhou */
    }
  }

  const unicos = new Map<string, ConteudoResumo>();
  for (const item of candidatos) {
    if (idOk(item) && !unicos.has(item.id)) unicos.set(item.id, item);
  }

  let pool = [...unicos.values()].filter((i) => {
    if (!pertenceAoGenero(i, cfg.keywords)) return false;
    if (i.ano > 0 && (i.ano < anoMin || i.ano > anoMax)) return false;
    if (notaMinima > 0 && (i.nota ?? 0) < notaMinima) return false;
    return true;
  });

  // fallback: se filtro de genero zerou tudo, tenta so keyword na busca sem exigir generos[]
  if (pool.length < quantidade) {
    const frouxo = [...unicos.values()].filter((i) => {
      if (i.ano > 0 && (i.ano < anoMin || i.ano > anoMax)) return false;
      if (notaMinima > 0 && (i.nota ?? 0) < notaMinima) return false;
      // ainda exclui se generos existem e NAO batem
      if ((i.generos ?? []).length > 0 && !pertenceAoGenero(i, cfg.keywords)) {
        return false;
      }
      return true;
    });
    pool = frouxo;
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
