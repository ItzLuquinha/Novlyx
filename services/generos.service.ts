import { CategoriaConteudo, Genero } from "@/types";
import { generosPorCategoria } from "@/lib/mock-data/generos";

export async function getGeneros(
  categoria: CategoriaConteudo
): Promise<Genero[]> {
  return generosPorCategoria(categoria);
}
