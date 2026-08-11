import { ConteudoResumo } from "@/types";
import { httpClient } from "@/lib/http-client";
import { API_HABILITADA, API_ROTAS } from "@/lib/api-config";
import {
  EmbedListResponse,
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

function idOk(item: ConteudoResumo): boolean {
  return Boolean(item.id) && !item.id.startsWith("tmp-");
}

export async function sortearFilme(opcoes: {
  generoId: string;
  anoMin?: number;
  anoMax?: number;
}): Promise<ConteudoResumo | null> {
  const { generoId, anoMin = 1970, anoMax = new Date().getFullYear() } = opcoes;
  const query = GENERO_PARA_QUERY[generoId] || generoId.replace(/-/g, " ");

  if (API_HABILITADA) {
    const candidatos: ConteudoResumo[] = [];

    
    const paginas = [1, 2, 3, Math.floor(Math.random() * 5) + 1];
    for (const page of paginas) {
      try {
        const data = await httpClient<EmbedListResponse>(API_ROTAS.buscaFilmes, {
          parametros: { q: query, page },
        });
        candidatos.push(...mapearListaPaginada(data, "filme").itens);
      } catch {
        
      }
    }

    try {
      const trending = await httpClient<EmbedListResponse>(
        API_ROTAS.filmesTrending,
        { parametros: { time_window: "week", page: 1 } }
      );
      candidatos.push(...mapearListaPaginada(trending, "filme").itens);
    } catch {
      
    }

    const unicos = new Map<string, ConteudoResumo>();
    for (const item of candidatos) {
      if (idOk(item) && !unicos.has(item.id)) {
        unicos.set(item.id, item);
      }
    }

    const lista = [...unicos.values()];
    const filtrados = lista.filter(
      (i) => i.ano >= anoMin && i.ano <= anoMax && i.ano > 0
    );
    const pool = filtrados.length > 0 ? filtrados : lista;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)] ?? null;
  }

  return null;
}
