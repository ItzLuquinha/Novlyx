export interface ResultadoPaginado<T> {
  itens: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  temProximaPagina: boolean;
}

export interface ParametrosListagem {
  pagina?: number;
  itensPorPagina?: number;
  generoId?: string;
  ordenarPor?: "recentes" | "populares" | "melhorAvaliados" | "alfabetica";
}

export interface ResultadoBusca {
  filmes: import("./conteudo").ConteudoResumo[];
  series: import("./conteudo").ConteudoResumo[];
  animes: import("./conteudo").ConteudoResumo[];
  doramas: import("./conteudo").ConteudoResumo[];
  canais: import("./canal").Canal[];
  eventos: import("./evento").EventoEsportivo[];
}
