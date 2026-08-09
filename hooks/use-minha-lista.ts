"use client";

import { useCallback, useEffect, useState } from "react";
import { ItemMinhaLista } from "@/types";
import {
  alternarMinhaLista,
  estaNaMinhaLista,
  getMinhaLista,
} from "@/services/minha-lista.service";

export function useMinhaLista() {
  const [itens, setItens] = useState<ItemMinhaLista[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setItens(getMinhaLista());
    setCarregado(true);
  }, []);

  const alternar = useCallback((item: Omit<ItemMinhaLista, "adicionadoEm">) => {
    alternarMinhaLista(item);
    setItens(getMinhaLista());
  }, []);

  return { itens, carregado, alternar };
}

export function useEstaNaMinhaLista(conteudoId: string) {
  const [presente, setPresente] = useState(false);

  useEffect(() => {
    setPresente(estaNaMinhaLista(conteudoId));
  }, [conteudoId]);

  const atualizar = useCallback(() => {
    setPresente(estaNaMinhaLista(conteudoId));
  }, [conteudoId]);

  return { presente, atualizar };
}
