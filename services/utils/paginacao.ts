import { ParametrosListagem, ResultadoPaginado } from "@/types";
import { ConteudoResumo } from "@/types";

export function paginarLista<T extends { generos?: ConteudoResumo["generos"] }>(
  lista: T[],
  parametros: ParametrosListagem
): ResultadoPaginado<T> {
  const { pagina = 1, itensPorPagina = 24, generoId, ordenarPor } = parametros;

  let filtrada = lista;

  if (generoId) {
    filtrada = filtrada.filter((item) =>
      item.generos?.some((g) => g.id === generoId)
    );
  }

  if (ordenarPor === "alfabetica") {
    filtrada = [...filtrada].sort((a: any, b: any) =>
      String(a.titulo ?? "").localeCompare(String(b.titulo ?? ""))
    );
  } else if (ordenarPor === "melhorAvaliados") {
    filtrada = [...filtrada].sort((a: any, b: any) => (b.nota ?? 0) - (a.nota ?? 0));
  } else if (ordenarPor === "recentes") {
    filtrada = [...filtrada].sort(
      (a: any, b: any) =>
        new Date(b.adicionadoEm ?? 0).getTime() -
        new Date(a.adicionadoEm ?? 0).getTime()
    );
  }

  const totalItens = filtrada.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
  const inicio = (pagina - 1) * itensPorPagina;
  const itens = filtrada.slice(inicio, inicio + itensPorPagina);

  return {
    itens,
    paginaAtual: pagina,
    totalPaginas,
    totalItens,
    temProximaPagina: pagina < totalPaginas,
  };
}
