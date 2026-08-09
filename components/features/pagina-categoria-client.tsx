"use client";

import { useState } from "react";
import { CategoriaConteudo } from "@/types";
import { useListagemInfinita } from "@/hooks/use-listagem-infinita";
import { useGeneros } from "@/hooks/use-generos";
import {
  FiltrosCategoria,
  OpcaoOrdenacao,
} from "@/components/features/filtros-categoria";
import { GridConteudoInfinito } from "@/components/features/grid-conteudo-infinito";

interface PaginaCategoriaClientProps {
  categoria: CategoriaConteudo;
  titulo: string;
}

export function PaginaCategoriaClient({
  categoria,
  titulo,
}: PaginaCategoriaClientProps) {
  const [generoSelecionado, setGeneroSelecionado] = useState<string | undefined>();
  const [ordenacao, setOrdenacao] = useState<OpcaoOrdenacao>("recentes");

  const { data: generos } = useGeneros(categoria);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useListagemInfinita(categoria, {
    generoId: generoSelecionado,
    ordenarPor: ordenacao,
    itensPorPagina: 24,
  });

  const itens = data?.pages.flatMap((pagina) => pagina.itens) ?? [];

  return (
    <div className="container py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-novlyx-white sm:text-3xl">
          {titulo}
        </h1>
        <FiltrosCategoria
          generos={generos ?? []}
          generoSelecionado={generoSelecionado}
          ordenacao={ordenacao}
          onMudarGenero={setGeneroSelecionado}
          onMudarOrdenacao={setOrdenacao}
        />
      </div>

      <GridConteudoInfinito
        itens={itens}
        carregando={isLoading}
        buscandoProximaPagina={isFetchingNextPage}
        temProximaPagina={Boolean(hasNextPage)}
        aoAtingirFinal={() => fetchNextPage()}
      />
    </div>
  );
}
