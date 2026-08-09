"use client";

import { useMemo, useState } from "react";
import { useEventos, useCategoriasEventos } from "@/hooks/use-eventos";
import { CardEvento } from "@/components/shared/card-evento";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EventoEsportivo } from "@/types";

export function EsportesClient() {
  const { data: eventos, isLoading } = useEventos();
  const { data: categorias } = useCategoriasEventos();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(
    null
  );

  const eventosFiltrados = useMemo((): EventoEsportivo[] => {
    const lista: EventoEsportivo[] = Array.isArray(eventos)
      ? (eventos as EventoEsportivo[])
      : [];
    if (!categoriaSelecionada) return lista;
    return lista.filter((evento) => evento.categoriaId === categoriaSelecionada);
  }, [eventos, categoriaSelecionada]);

  const eventosAoVivo = eventosFiltrados.filter((e) => e.status === "ao_vivo");
  const eventosAgendados = eventosFiltrados.filter((e) => e.status === "agendado");
  const eventosEncerrados = eventosFiltrados.filter((e) => e.status === "encerrado");

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="mb-2 text-2xl font-bold text-novlyx-white sm:text-3xl">
        Esportes
      </h1>
      <p className="mb-6 text-sm text-novlyx-gray-light">
        Agenda ilustrativa para navegação. Não há transmissão real de jogos nesta versão.
      </p>
      <p className="mb-8 text-novlyx-gray-light">
        Acompanhe jogos ao vivo, proximos confrontos e resultados dos
        principais campeonatos.
      </p>

      <div className="mb-8 scrollbar-hide flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setCategoriaSelecionada(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            !categoriaSelecionada
              ? "bg-novlyx-gold text-novlyx-black"
              : "bg-white/5 text-novlyx-gray-light hover:bg-white/10"
          )}
        >
          Todos
        </button>
        {categorias?.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            onClick={() => setCategoriaSelecionada(categoria.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              categoriaSelecionada === categoria.id
                ? "bg-novlyx-gold text-novlyx-black"
                : "bg-white/5 text-novlyx-gray-light hover:bg-white/10"
            )}
          >
            {categoria.nome}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="ao-vivo">
          <TabsList>
            <TabsTrigger value="ao-vivo">
              Ao Vivo ({eventosAoVivo.length})
            </TabsTrigger>
            <TabsTrigger value="agendados">
              Futuros ({eventosAgendados.length})
            </TabsTrigger>
            <TabsTrigger value="encerrados">
              Encerrados ({eventosEncerrados.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ao-vivo">
            <GradeEventos eventos={eventosAoVivo} />
          </TabsContent>
          <TabsContent value="agendados">
            <GradeEventos eventos={eventosAgendados} />
          </TabsContent>
          <TabsContent value="encerrados">
            <GradeEventos eventos={eventosEncerrados} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function GradeEventos({
  eventos,
}: {
  eventos: ReturnType<typeof useEventos>["data"];
}) {
  if (!eventos || eventos.length === 0) {
    return (
      <p className="py-16 text-center text-novlyx-gray-light">
        Nenhum evento encontrado nesta categoria
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {eventos.map((evento) => (
        <CardEvento key={evento.id} evento={evento} />
      ))}
    </div>
  );
}
