import { useQuery } from "@tanstack/react-query";
import { getCanais, getCategoriasCanais } from "@/services";
import { Canal, CategoriaCanal } from "@/types";

export function useCanais() {
  return useQuery<Canal[]>({
    queryKey: ["canais-iptv-v1"],
    queryFn: () => getCanais(),
    staleTime: 1000 * 60 * 30,
  });
}

export function useCategoriasCanais() {
  return useQuery<CategoriaCanal[]>({
    queryKey: ["categorias-canais-iptv-v1"],
    queryFn: () => getCategoriasCanais(),
    staleTime: 1000 * 60 * 30,
  });
}
