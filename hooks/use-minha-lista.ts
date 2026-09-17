"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ItemMinhaLista } from "@/types";
import {
  alternarMinhaLista,
  estaNaMinhaLista,
  getMinhaLista,
} from "@/services/minha-lista.service";
import { chaveEstavel } from "@/lib/identidade";

export function useMinhaLista() {
  const [itens, setItens] = useState<ItemMinhaLista[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setItens(getMinhaLista());
    setCarregado(true);
  }, []);

  const alternar = useCallback(
    (
      item: Omit<ItemMinhaLista, "adicionadoEm" | "idInterno"> & {
        idInterno?: string;
      }
    ) => {
      alternarMinhaLista(item);
      setItens(getMinhaLista());
    },
    []
  );

  return { itens, carregado, alternar };
}

export function useEstaNaMinhaLista(
  item:
    | Pick<
        ItemMinhaLista,
        "categoria" | "tmdbId" | "imdbId" | "idInterno" | "conteudoId"
      >
    | string
) {
  const chave = useMemo(() => {
    if (typeof item === "string") return item;
    return chaveEstavel(item);
  }, [item]);

  const [presente, setPresente] = useState(false);

  useEffect(() => {
    setPresente(estaNaMinhaLista(item));
  }, [chave, item]);

  const atualizar = useCallback(() => {
    setPresente(estaNaMinhaLista(item));
  }, [item]);

  return { presente, atualizar };
}
