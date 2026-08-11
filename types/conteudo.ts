export type CategoriaConteudo = "filme" | "serie" | "anime" | "dorama";

export type QualidadeVideo = "SD" | "HD" | "FULL HD" | "4K" | "Cinema";

export interface Genero {
  id: string;
  nome: string;
}

export interface Episodio {
  id: string;
  numero: number;
  temporadaId: string;
  titulo: string;
  descricao: string;
  duracaoMinutos: number;
  posterUrl: string;
  dataLancamento: string;
}

export interface Temporada {
  id: string;
  numero: number;
  titulo: string;
  totalEpisodios: number;
  posterUrl: string;
  episodios: Episodio[];
}

export interface ConteudoResumo {
  id: string;
  titulo: string;
  tituloOriginal?: string;
  categoria: CategoriaConteudo;
  ano: number;
  nota: number;
  qualidade: QualidadeVideo;
  posterUrl: string;
  bannerUrl: string;
  generos: Genero[];
  
  idiomaOriginal?: string;
  
  statusLancamento?: string;
  
  emCinema?: boolean;
  emAlta?: boolean;
  lancamento?: boolean;
  adicionadoEm: string;
}

export interface ConteudoDetalhado extends ConteudoResumo {
  descricao: string;
  duracaoMinutos?: number;
  diretor?: string;
  elenco: string[];
  trailerUrl?: string;
  temporadas?: Temporada[];
  totalTemporadas?: number;
  paisOrigem: string;
  idiomaOriginal: string;
  classificacaoIndicativa: string;
  semelhantes: ConteudoResumo[];
}

export interface ProgressoContinuarAssistindo {
  conteudoId: string;
  categoria: CategoriaConteudo;
  titulo: string;
  posterUrl: string;
  temporadaId?: string;
  temporadaNumero?: number;
  episodioId?: string;
  episodioNumero?: number;
  tempoAtualSegundos: number;
  duracaoTotalSegundos: number;
  atualizadoEm: string;
}

export interface ItemMinhaLista {
  conteudoId: string;
  categoria: CategoriaConteudo;
  titulo: string;
  posterUrl: string;
  ano: number;
  nota: number;
  adicionadoEm: string;
}
