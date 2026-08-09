"use client";

import { useCallback, useEffect, useState } from "react";
import { ProgressoContinuarAssistindo } from "@/types";
import {
  EVENTO_PROGRESSO,
  getContinuarAssistindo,
  getProgressoConteudo,
  limparContinuarAssistindo,
  salvarProgresso,
} from "@/services/continuar-assistindo.service";

export function useContinuarAssistindo() {
  const [itens, setItens] = useState<ProgressoContinuarAssistindo[]>([]);
  const [carregado, setCarregado] = useState(false);

  const recarregar = useCallback(() => {
    setItens(getContinuarAssistindo());
  }, []);

  useEffect(() => {
    recarregar();
    setCarregado(true);
    function onUpdate() {
      recarregar();
    }
    window.addEventListener(EVENTO_PROGRESSO, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(EVENTO_PROGRESSO, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [recarregar]);

  const limpar = useCallback(() => {
    limparContinuarAssistindo();
    setItens([]);
  }, []);

  return { itens, carregado, limpar, recarregar };
}

export function useProgressoConteudo(conteudoId: string) {
  const [progresso, setProgresso] = useState<ProgressoContinuarAssistindo | null>(
    null
  );

  useEffect(() => {
    setProgresso(getProgressoConteudo(conteudoId));
    function onUpdate() {
      setProgresso(getProgressoConteudo(conteudoId));
    }
    window.addEventListener(EVENTO_PROGRESSO, onUpdate);
    return () => window.removeEventListener(EVENTO_PROGRESSO, onUpdate);
  }, [conteudoId]);

  const salvar = useCallback(
    (dados: Omit<ProgressoContinuarAssistindo, "atualizadoEm">) => {
      salvarProgresso(dados);
      setProgresso(getProgressoConteudo(conteudoId));
    },
    [conteudoId]
  );

  return { progresso, salvar };
}
