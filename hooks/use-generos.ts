import { useQuery } from "@tanstack/react-query";
import { CategoriaConteudo } from "@/types";
import { getGeneros } from "@/services";

export function useGeneros(categoria: CategoriaConteudo) {
  return useQuery({
    queryKey: ["generos", categoria],
    queryFn: () => getGeneros(categoria),
  });
}
