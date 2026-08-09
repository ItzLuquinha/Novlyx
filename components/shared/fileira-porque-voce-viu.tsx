"use client";

import { useEffect, useState } from "react";
import { ConteudoResumo } from "@/types";
import {
  EVENTO_HISTORICO,
  getHistorico,
  ItemHistorico,
} from "@/services/historico.service";
import { getRecomendacoesPorHistorico } from "@/services/recomendacoes.service";
import { FileiraConteudo } from "@/components/shared/fileira-conteudo";

/** Tempo mínimo assistido para considerar "viu de verdade" (2 min). */
const MIN_SEGUNDOS = 120;

export function FileiraPorqueVoceViu() {
  const [base, setBase] = useState<ItemHistorico | null>(null);
  const [itens, setItens] = useState<ConteudoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    function escolherBase() {
      const hist = getHistorico();
      // Prefere o que assistiu mais tempo; senão o mais recente com ≥ 15s
      const candidatos = hist.filter((h) => h.tempoAtualSegundos >= 15);
      if (candidatos.length === 0) {
        setBase(null);
        setItens([]);
        setCarregando(false);
        return;
      }
      const comTempo = candidatos.filter(
        (h) => h.tempoAtualSegundos >= MIN_SEGUNDOS
      );
      const escolhido =
        (comTempo.length > 0 ? comTempo : candidatos).sort(
          (a, b) => b.tempoAtualSegundos - a.tempoAtualSegundos
        )[0] ?? candidatos[0]!;
      setBase(escolhido);
    }

    escolherBase();
    window.addEventListener(EVENTO_HISTORICO, escolherBase);
    return () => window.removeEventListener(EVENTO_HISTORICO, escolherBase);
  }, []);

  useEffect(() => {
    if (!base) {
      setCarregando(false);
      return;
    }

    let cancelado = false;
    setCarregando(true);

    void (async () => {
      try {
        const lista = await getRecomendacoesPorHistorico(
          {
            conteudoId: base.conteudoId,
            categoria: base.categoria,
            titulo: base.titulo,
          },
          20
        );
        if (!cancelado) setItens(lista);
      } catch {
        if (!cancelado) setItens([]);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [base]);

  if (!base) return null;
  if (!carregando && itens.length === 0) return null;

  const tituloCurto =
    base.titulo.length > 36
      ? `${base.titulo.slice(0, 34)}…`
      : base.titulo;

  return (
    <FileiraConteudo
      titulo={`Porque você viu ${tituloCurto}`}
      itens={itens}
      carregando={carregando}
    />
  );
}
