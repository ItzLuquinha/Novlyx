import { CategoriaConteudo, Genero } from "@/types";
import { generosPorCategoria } from "@/lib/mock-data/generos";

/**
 * Gêneros - lista local (a API 2embed não expõe endpoint de gêneros).
 */
export async function getGeneros(
  categoria: CategoriaConteudo
): Promise<Genero[]> {
  return generosPorCategoria(categoria);
}
