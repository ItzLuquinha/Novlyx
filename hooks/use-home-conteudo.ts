import { useQuery } from "@tanstack/react-query";
import { getHomePrioridade, getHomeSecundaria } from "@/services";
import { ConteudoResumo } from "@/types";

const VAZIO: ConteudoResumo[] = [];

/**
 * Home em 2 camadas:
 * 1) prioridade = banner + em alta + populares (1 mix trending)
 * 2) secundaria = BR + lancamentos (reusa cache de trending quando der)
 */
export function useHomeConteudo() {
  const prioridade = useQuery({
    queryKey: ["home-prioridade-v1"],
    queryFn: () => getHomePrioridade(20),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1200,
  });

  const secundaria = useQuery({
    queryKey: ["home-secundaria-v1"],
    queryFn: () => getHomeSecundaria(20),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1500,
    // comeca logo; nao precisa esperar a prioridade (cache compartilha trending)
  });

  const data = {
    destaques: prioridade.data?.destaques ?? VAZIO,
    emAlta: prioridade.data?.emAlta ?? VAZIO,
    populares: prioridade.data?.populares ?? VAZIO,
    trendingBR: secundaria.data?.trendingBR ?? VAZIO,
    lancamentosSemana: secundaria.data?.lancamentosSemana ?? VAZIO,
    lancamentos: secundaria.data?.lancamentos ?? VAZIO,
  };

  const prioridadePronta = Boolean(prioridade.data);
  const carregandoPrioridade =
    prioridade.isLoading || (prioridade.isFetching && !prioridade.data);
  const carregandoSecundaria =
    secundaria.isLoading || (secundaria.isFetching && !secundaria.data);

  const temAlgo =
    data.destaques.length > 0 ||
    data.emAlta.length > 0 ||
    data.populares.length > 0;

  return {
    data,
    /** true so enquanto o bloco de cima ainda nao chegou */
    carregandoPrioridade,
    carregandoSecundaria,
    /** compat: loading geral so no primeiro paint critico */
    isLoading: carregandoPrioridade,
    isFetching: prioridade.isFetching || secundaria.isFetching,
    isError: prioridade.isError && !temAlgo,
    prioridadePronta,
    temAlgo,
    refetch: async () => {
      await Promise.all([prioridade.refetch(), secundaria.refetch()]);
    },
  };
}
