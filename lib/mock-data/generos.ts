import { Genero } from "@/types";

export const GENEROS_FILMES: Genero[] = [
  { id: "acao", nome: "Acao" },
  { id: "drama", nome: "Drama" },
  { id: "comedia", nome: "Comedia" },
  { id: "terror", nome: "Terror" },
  { id: "romance", nome: "Romance" },
  { id: "ficcao-cientifica", nome: "Ficcao Cientifica" },
  { id: "documentario", nome: "Documentario" },
  { id: "aventura", nome: "Aventura" },
  { id: "suspense", nome: "Suspense" },
  { id: "animacao", nome: "Animacao" },
  { id: "fantasia", nome: "Fantasia" },
  { id: "crime", nome: "Crime" },
];

export const GENEROS_SERIES: Genero[] = [
  { id: "drama", nome: "Drama" },
  { id: "acao", nome: "Acao" },
  { id: "comedia", nome: "Comedia" },
  { id: "crime", nome: "Crime" },
  { id: "suspense", nome: "Suspense" },
  { id: "ficcao-cientifica", nome: "Ficcao Cientifica" },
  { id: "fantasia", nome: "Fantasia" },
  { id: "documentario", nome: "Documentario" },
  { id: "romance", nome: "Romance" },
  { id: "terror", nome: "Terror" },
];

export const GENEROS_ANIMES: Genero[] = [
  { id: "shonen", nome: "Shonen" },
  { id: "seinen", nome: "Seinen" },
  { id: "shojo", nome: "Shojo" },
  { id: "isekai", nome: "Isekai" },
  { id: "mecha", nome: "Mecha" },
  { id: "slice-of-life", nome: "Slice of Life" },
  { id: "fantasia", nome: "Fantasia" },
  { id: "acao", nome: "Acao" },
  { id: "romance", nome: "Romance" },
  { id: "esportes", nome: "Esportes" },
];

export const GENEROS_DORAMAS: Genero[] = [
  { id: "romance", nome: "Romance" },
  { id: "drama", nome: "Drama" },
  { id: "comedia-romantica", nome: "Comedia Romantica" },
  { id: "historico", nome: "Historico" },
  { id: "suspense", nome: "Suspense" },
  { id: "familia", nome: "Familia" },
  { id: "escolar", nome: "Escolar" },
  { id: "medico", nome: "Medico" },
];

export function generosPorCategoria(categoria: string): Genero[] {
  switch (categoria) {
    case "filme":
      return GENEROS_FILMES;
    case "serie":
      return GENEROS_SERIES;
    case "anime":
      return GENEROS_ANIMES;
    case "dorama":
      return GENEROS_DORAMAS;
    default:
      return [];
  }
}
