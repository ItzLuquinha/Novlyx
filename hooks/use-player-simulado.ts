"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CategoriaConteudo } from "@/types";
import { salvarProgresso } from "@/services/continuar-assistindo.service";

interface UsePlayerSimuladoProps {
  conteudoId: string;
  categoria: CategoriaConteudo;
  titulo: string;
  posterUrl: string;
  duracaoTotalSegundos: number;
  tempoInicialSegundos?: number;
  temporadaId?: string;
  temporadaNumero?: number;
  episodioId?: string;
  episodioNumero?: number;
}

export function usePlayerSimulado({
  conteudoId,
  categoria,
  titulo,
  posterUrl,
  duracaoTotalSegundos,
  tempoInicialSegundos = 0,
  temporadaId,
  temporadaNumero,
  episodioId,
  episodioNumero,
}: UsePlayerSimuladoProps) {
  const [tocando, setTocando] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(tempoInicialSegundos);
  const [volume, setVolume] = useState(80);
  const [mudo, setMudo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (tocando) {
      intervalRef.current = setInterval(() => {
        setTempoAtual((atual) => {
          const proximo = atual + 1;
          if (proximo >= duracaoTotalSegundos) {
            setTocando(false);
            return duracaoTotalSegundos;
          }
          return proximo;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tocando, duracaoTotalSegundos]);

  useEffect(() => {
    const intervaloSalvar = setInterval(() => {
      salvarProgresso({
        conteudoId,
        categoria,
        titulo,
        posterUrl,
        temporadaId,
        temporadaNumero,
        episodioId,
        episodioNumero,
        tempoAtualSegundos: tempoAtual,
        duracaoTotalSegundos,
      });
    }, 5000);

    return () => clearInterval(intervaloSalvar);
  }, [
    conteudoId,
    categoria,
    titulo,
    posterUrl,
    temporadaId,
    temporadaNumero,
    episodioId,
    episodioNumero,
    tempoAtual,
    duracaoTotalSegundos,
  ]);

  useEffect(() => {
    return () => {
      salvarProgresso({
        conteudoId,
        categoria,
        titulo,
        posterUrl,
        temporadaId,
        temporadaNumero,
        episodioId,
        episodioNumero,
        tempoAtualSegundos: tempoAtual,
        duracaoTotalSegundos,
      });
    };
    
  }, []);

  const alternarPlay = useCallback(() => setTocando((t) => !t), []);
  const buscar = useCallback((segundos: number) => setTempoAtual(segundos), []);
  const alternarMudo = useCallback(() => setMudo((m) => !m), []);

  return {
    tocando,
    tempoAtual,
    volume,
    mudo,
    alternarPlay,
    buscar,
    setVolume,
    alternarMudo,
  };
}
