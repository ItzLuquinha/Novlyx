import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { pesquisarConteudo } from "@/services";

export function useDebounce<T>(valor: T, atrasoMs = 350): T {
  const [valorAtrasado, setValorAtrasado] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setValorAtrasado(valor), atrasoMs);
    return () => clearTimeout(timer);
  }, [valor, atrasoMs]);

  return valorAtrasado;
}

export function useBusca(query: string) {
  const queryAtrasada = useDebounce(query, 350);

  return useQuery({
    queryKey: ["busca", queryAtrasada],
    queryFn: () => pesquisarConteudo(queryAtrasada),
    enabled: queryAtrasada.trim().length > 1,
  });
}
