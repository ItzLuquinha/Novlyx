import { ItemCalendario } from "@/types";
import { CATALOGO_ANIMES, CATALOGO_DORAMAS, CATALOGO_SERIES } from "./gerador-catalogo";

function gerarItensCalendario(): ItemCalendario[] {
  const base = [
    ...CATALOGO_SERIES.slice(0, 15).map((c) => ({ ...c, tipo: "serie" as const })),
    ...CATALOGO_ANIMES.slice(0, 15).map((c) => ({ ...c, tipo: "anime" as const })),
    ...CATALOGO_DORAMAS.slice(0, 10).map((c) => ({ ...c, tipo: "dorama" as const })),
  ];

  return base.map((item, i) => ({
    id: `calendario-${item.id}`,
    titulo: item.titulo,
    posterUrl: item.posterUrl,
    data: new Date(
      Date.now() + (i - base.length / 2) * 1000 * 60 * 60 * 24
    ).toISOString(),
    temporadaNumero: 1 + (i % 3),
    episodioNumero: 1 + (i % 12),
    categoria: item.tipo,
  }));
}

export const CALENDARIO: ItemCalendario[] = gerarItensCalendario();
