import { CategoriaEvento, EventoEsportivo, ItemCalendario } from "@/types";
import { CALENDARIO, CATEGORIAS_EVENTOS, EVENTOS_ESPORTIVOS } from "@/lib/mock-data";

/**
 * Eventos esportivos - dados locais ilustrativos.
 * A API 2embed não oferece agenda esportiva.
 */
export async function getEventos(filtros?: {
  sport?: string;
  status?: string;
  q?: string;
  limit?: number;
}): Promise<EventoEsportivo[]> {
  let lista = [...EVENTOS_ESPORTIVOS];
  if (filtros?.sport) {
    lista = lista.filter((e) => e.categoriaId === filtros.sport);
  }
  if (filtros?.status) {
    lista = lista.filter((e) => e.status === filtros.status);
  }
  if (filtros?.q) {
    const q = filtros.q.toLowerCase();
    lista = lista.filter(
      (e) =>
        e.titulo.toLowerCase().includes(q) ||
        e.campeonato?.toLowerCase().includes(q)
    );
  }
  if (filtros?.limit) lista = lista.slice(0, filtros.limit);
  return lista;
}

export async function getCategoriasEventos(): Promise<CategoriaEvento[]> {
  return CATEGORIAS_EVENTOS;
}

export async function getCalendario(): Promise<ItemCalendario[]> {
  return CALENDARIO;
}
