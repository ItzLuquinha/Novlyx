import { useInfiniteQuery } from "@tanstack/react-query";
import { CategoriaConteudo, ParametrosListagem } from "@/types";
import { getAnimes, getDoramas, getFilmes, getSeries } from "@/services";

const SERVICO_POR_CATEGORIA: Record<
  CategoriaConteudo,
  (parametros: ParametrosListagem) => ReturnType<typeof getFilmes>
> = {
  filme: getFilmes,
  serie: getSeries,
  anime: getAnimes,
  dorama: getDoramas,
};

export function useListagemInfinita(
  categoria: CategoriaConteudo,
  filtros: Omit<ParametrosListagem, "pagina">
) {
  return useInfiniteQuery({
    queryKey: ["listagem", categoria, filtros],
    queryFn: ({ pageParam }) =>
      SERVICO_POR_CATEGORIA[categoria]({ ...filtros, pagina: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (paginaAtual) =>
      paginaAtual.temProximaPagina ? paginaAtual.paginaAtual + 1 : undefined,
  });
}
