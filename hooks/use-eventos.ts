import { useQuery } from "@tanstack/react-query";
import { getCalendario, getCategoriasEventos, getEventos } from "@/services";
import { CategoriaEvento, EventoEsportivo, ItemCalendario } from "@/types";

export function useEventos() {
  return useQuery<EventoEsportivo[]>({
    queryKey: ["eventos"],
    queryFn: () => getEventos(),
  });
}

export function useCategoriasEventos() {
  return useQuery<CategoriaEvento[]>({
    queryKey: ["categorias-eventos"],
    queryFn: () => getCategoriasEventos(),
  });
}

export function useCalendario() {
  return useQuery<ItemCalendario[]>({
    queryKey: ["calendario"],
    queryFn: () => getCalendario(),
  });
}
