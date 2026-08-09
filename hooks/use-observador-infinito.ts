"use client";

import { useEffect, useRef } from "react";

interface UseObservadorInfinitoProps {
  aoAtingirFinal: () => void;
  habilitado: boolean;
}

export function useObservadorInfinito({
  aoAtingirFinal,
  habilitado,
}: UseObservadorInfinitoProps) {
  const sentinelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinela = sentinelaRef.current;
    if (!sentinela || !habilitado) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0]?.isIntersecting) {
          aoAtingirFinal();
        }
      },
      { rootMargin: "400px" }
    );

    observador.observe(sentinela);
    return () => observador.disconnect();
  }, [aoAtingirFinal, habilitado]);

  return sentinelaRef;
}
