import { useQuery } from "@tanstack/react-query";
import { ParametrosListagem } from "@/types";
import { getAnimePorId, getAnimes } from "@/services";

export function useAnimes(parametros: ParametrosListagem = {}) {
  return useQuery({
    queryKey: ["animes", parametros],
    queryFn: () => getAnimes(parametros),
  });
}

export function useAnime(id: string) {
  return useQuery({
    queryKey: ["anime", id],
    queryFn: () => getAnimePorId(id),
    enabled: Boolean(id),
  });
}
