"use client";

import { ConteudoResumo } from "@/types";
import { CardConteudo } from "@/components/shared/card-conteudo";
import { CardConteudoSkeleton } from "@/components/shared/card-conteudo-skeleton";
import { useObservadorInfinito } from "@/hooks/use-observador-infinito";
import { Loader2 } from "lucide-react";

interface GridConteudoInfinitoProps {
  itens: ConteudoResumo[];
  carregando: boolean;
  buscandoProximaPagina: boolean;
  temProximaPagina: boolean;
  aoAtingirFinal: () => void;
}

export function GridConteudoInfinito({
  itens,
  carregando,
  buscandoProximaPagina,
  temProximaPagina,
  aoAtingirFinal,
}: GridConteudoInfinitoProps) {
  const sentinelaRef = useObservadorInfinito({
    aoAtingirFinal,
    habilitado: temProximaPagina && !carregando,
  });

  if (carregando) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 18 }).map((_, i) => (
          <CardConteudoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <p className="text-lg font-medium text-novlyx-white">
          Nenhum conteudo encontrado
        </p>
        <p className="text-sm text-novlyx-gray-light">
          Tente ajustar os filtros para ver mais resultados
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {itens.map((item) => (
          <CardConteudo key={item.id} conteudo={item} />
        ))}
      </div>

      {temProximaPagina && (
        <div ref={sentinelaRef} className="flex justify-center py-8">
          {buscandoProximaPagina && (
            <Loader2 className="h-6 w-6 animate-spin text-novlyx-gold" />
          )}
        </div>
      )}
    </div>
  );
}
