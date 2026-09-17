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

export function useProgressoConteudo(
  conteudoId: string,
  season?: number,
  episode?: number
) {
  const [progresso, setProgresso] = useState<ProgressoContinuarAssistindo | null>(
    null
  );

  useEffect(() => {
    setProgresso(getProgressoConteudo(conteudoId, season, episode));
    function onUpdate() {
      setProgresso(getProgressoConteudo(conteudoId, season, episode));
    }
    window.addEventListener(EVENTO_PROGRESSO, onUpdate);
    return () => window.removeEventListener(EVENTO_PROGRESSO, onUpdate);
  }, [conteudoId, season, episode]);

  const salvar = useCallback(
    (
      dados: Omit<
        ProgressoContinuarAssistindo,
        "atualizadoEm" | "progressKey" | "idInterno"
      > & {
        progressKey?: string;
        idInterno?: string;
      }
    ) => {
      salvarProgresso(dados);
      setProgresso(
        getProgressoConteudo(
          conteudoId,
          dados.temporadaNumero,
          dados.episodioNumero
        )
      );
    },
    [conteudoId]
  );

  return { progresso, salvar };
}
