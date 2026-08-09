import { useQuery } from "@tanstack/react-query";
import { ParametrosListagem } from "@/types";
import { getFilmePorId, getFilmes } from "@/services";

export function useFilmes(parametros: ParametrosListagem = {}) {
  return useQuery({
    queryKey: ["filmes", parametros],
    queryFn: () => getFilmes(parametros),
  });
}

export function useFilme(id: string) {
  return useQuery({
    queryKey: ["filme", id],
    queryFn: () => getFilmePorId(id),
    enabled: Boolean(id),
  });
}
