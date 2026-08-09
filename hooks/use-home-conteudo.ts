import { useQuery } from "@tanstack/react-query";
import {
  getAdicionadosRecentemente,
  getDestaquesBanner,
  getEmAlta,
  getLancamentos,
  getLancamentosDaSemana,
  getMaisPopulares,
  getPorGenero,
  getRecomendados,
  getTrendingBR,
} from "@/services";
import { ConteudoResumo } from "@/types";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[home]", e);
    return fallback;
  }
}

export function useHomeConteudo() {
  return useQuery({
    queryKey: ["home-conteudo-v3"],
    queryFn: async () => {
      const vazio: ConteudoResumo[] = [];

      // Lote 1 - o essencial (banner + fileiras principais)
      const [destaques, emAlta, populares, lancamentos] = await Promise.all([
        safe(() => getDestaquesBanner(6), vazio),
        safe(() => getEmAlta(20), vazio),
        safe(() => getMaisPopulares(20), vazio),
        safe(() => getLancamentos(20), vazio),
      ]);

      // Lote 2 - extras
      const [
        trendingBR,
        lancamentosSemana,
        recomendados,
        recentes,
      ] = await Promise.all([
        safe(() => getTrendingBR(20), vazio),
        safe(() => getLancamentosDaSemana(20), vazio),
        safe(() => getRecomendados(20), vazio),
        safe(() => getAdicionadosRecentemente(20), vazio),
      ]);

      // Lote 3 - gêneros
      const [acao, drama, comedia, terror, romance, ficcaoCientifica, documentarios] =
        await Promise.all([
          safe(() => getPorGenero("acao", 16), vazio),
          safe(() => getPorGenero("drama", 16), vazio),
          safe(() => getPorGenero("comedia", 16), vazio),
          safe(() => getPorGenero("terror", 16), vazio),
          safe(() => getPorGenero("romance", 16), vazio),
          safe(() => getPorGenero("ficcao-cientifica", 16), vazio),
          safe(() => getPorGenero("documentario", 16), vazio),
        ]);

      return {
        destaques,
        emAlta,
        trendingBR,
        lancamentosSemana,
        lancamentos,
        populares,
        recomendados,
        recentes,
        acao,
        drama,
        comedia,
        terror,
        romance,
        ficcaoCientifica,
        documentarios,
      };
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 1500,
  });
}
