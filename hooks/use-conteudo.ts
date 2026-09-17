import { useQuery } from "@tanstack/react-query";
import { CategoriaConteudo } from "@/types";
import { getConteudoPorCategoria, getConteudoPorId } from "@/services";

export function useConteudo(id: string, categoria?: CategoriaConteudo) {
  return useQuery({
    queryKey: ["conteudo", categoria || "legado", id],
    queryFn: () =>
      categoria
        ? getConteudoPorCategoria(categoria, id)
        : getConteudoPorId(id),
    enabled: Boolean(id),
  });
}
