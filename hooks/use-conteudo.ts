import { useQuery } from "@tanstack/react-query";
import { getConteudoPorId } from "@/services";

export function useConteudo(id: string) {
  return useQuery({
    queryKey: ["conteudo", id],
    queryFn: () => getConteudoPorId(id),
    enabled: Boolean(id),
  });
}
