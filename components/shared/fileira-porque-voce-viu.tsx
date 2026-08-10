"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileiraConteudo } from "@/components/shared/fileira-conteudo";
import {
  getHistorico,
  ItemHistorico,
} from "@/services/historico.service";
import { getContinuarAssistindo } from "@/services/continuar-assistindo.service";
import { getRecomendacoesPorHistorico } from "@/services/recomendacoes.service";
import { ConteudoResumo } from "@/types";

/**
 * Pega a base mais recente: continuar assistindo > histórico.
 * Busca similares por ID e completa com busca por título.
 */
export function FileiraPorqueVoceViu() {
  const [base, setBase] = useState<{
    conteudoId: string;
    categoria: ItemHistorico["categoria"];
    titulo: string;
  } | null>(null);
  const [itens, setItens] = useState<ConteudoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const continuar = getContinuarAssistindo()[0];
    const hist = getHistorico()[0];
    const origem = continuar
      ? {
          conteudoId: continuar.conteudoId,
          categoria: continuar.categoria,
          titulo: continuar.titulo,
        }
      : hist
        ? {
            conteudoId: hist.conteudoId,
            categoria: hist.categoria,
            titulo: hist.titulo,
          }
        : null;
    setBase(origem);
    if (!origem) setCarregando(false);
  }, []);

  useEffect(() => {
    if (!base) return;
    let cancelado = false;

    (async () => {
      setCarregando(true);
      try {
        const lista = await getRecomendacoesPorHistorico(
          {
            conteudoId: base.conteudoId,
            categoria: base.categoria,
            titulo: base.titulo,
          },
          24
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
    base.titulo.length > 28 ? `${base.titulo.slice(0, 26)}…` : base.titulo;

  return (
    <div className="space-y-2">
      <FileiraConteudo
        titulo={`Porque você viu ${tituloCurto}`}
        itens={itens}
        carregando={carregando}
      />
      <p className="px-1 text-[11px] text-white/30">
        Baseado no que você assistiu por último ·{" "}
        <Link
          href={`/conteudo/${base.conteudoId}`}
          className="text-novlyx-gold/70 hover:underline"
        >
          ver original
        </Link>
      </p>
    </div>
  );
}
