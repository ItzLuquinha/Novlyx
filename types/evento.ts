export type StatusEvento = "ao_vivo" | "agendado" | "encerrado";

export interface CategoriaEvento {
  id: string;
  nome: string;
}

export interface EventoEsportivo {
  id: string;
  titulo: string;
  campeonato: string;
  categoriaId: string;
  categoriaNome: string;
  timeCasa: string;
  timeCasaEscudoUrl: string;
  timeVisitante: string;
  timeVisitanteEscudoUrl: string;
  imagemUrl: string;
  dataHora: string;
  status: StatusEvento;
  canal: string;
  placarCasa?: number;
  placarVisitante?: number;
}

export interface ItemCalendario {
  id: string;
  titulo: string;
  posterUrl: string;
  data: string;
  temporadaNumero: number;
  episodioNumero: number;
  categoria: "serie" | "anime" | "dorama";
}
