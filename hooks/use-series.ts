import { useQuery } from "@tanstack/react-query";
import { ParametrosListagem } from "@/types";
import { getSeriePorId, getSeries } from "@/services";

export function useSeries(parametros: ParametrosListagem = {}) {
  return useQuery({
    queryKey: ["series", parametros],
    queryFn: () => getSeries(parametros),
  });
}

export function useSerie(id: string) {
  return useQuery({
    queryKey: ["serie", id],
    queryFn: () => getSeriePorId(id),
    enabled: Boolean(id),
  });
}
