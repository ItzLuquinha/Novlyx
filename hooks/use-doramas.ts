import { useQuery } from "@tanstack/react-query";
import { ParametrosListagem } from "@/types";
import { getDoramaPorId, getDoramas } from "@/services";

export function useDoramas(parametros: ParametrosListagem = {}) {
  return useQuery({
    queryKey: ["doramas", parametros],
    queryFn: () => getDoramas(parametros),
  });
}

export function useDorama(id: string) {
  return useQuery({
    queryKey: ["dorama", id],
    queryFn: () => getDoramaPorId(id),
    enabled: Boolean(id),
  });
}
