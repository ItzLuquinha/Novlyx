"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { BannerDestaque } from "@/components/features/banner-destaque";
import { FileiraConteudo } from "@/components/shared/fileira-conteudo";
import { FileiraContinuarAssistindo } from "@/components/shared/fileira-continuar-assistindo";
import { FileiraPorqueVoceViu } from "@/components/shared/fileira-porque-voce-viu";
import { useHomeConteudo } from "@/hooks/use-home-conteudo";
import { MedidorConexao } from "@/components/shared/medidor-conexao";
import { Button } from "@/components/ui/button";

export function HomeClient() {
  const { data, isLoading, isFetching, isError, refetch } = useHomeConteudo();

  const carregando = isLoading || (isFetching && !data);
  const temAlgo =
    (data?.destaques?.length ?? 0) > 0 ||
    (data?.emAlta?.length ?? 0) > 0 ||
    (data?.populares?.length ?? 0) > 0;

  return (
    <>
      <BannerDestaque itens={data?.destaques ?? []} />

      {/* pt quando não há banner (evita ficar sob o header fixo) */}
      <div
        className={
          (data?.destaques?.length ?? 0) > 0
            ? "container relative z-10 -mt-2 flex flex-col gap-10 pb-20 sm:-mt-4 sm:gap-12"
            : "container relative z-10 flex flex-col gap-10 pb-20 pt-24 sm:gap-12"
        }
      >
        <Link
          href="/sorteio"
          className="group flex items-center gap-3 rounded-2xl border border-novlyx-gold/25 bg-novlyx-gold/5 px-5 py-4 transition-all hover:border-novlyx-gold/50 hover:bg-novlyx-gold/10"
        >
          <span className="text-2xl">🎲</span>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-white group-hover:text-novlyx-gold sm:text-base">
              Me surpreenda
            </p>
            <p className="text-xs text-white/40">
              Não sabe o que assistir? Escolha o gênero e o ano. A gente sorteia.
            </p>
          </div>
          <span className="hidden text-xs text-novlyx-gold/70 sm:inline">
            Sortear →
          </span>
        </Link>

        <FileiraContinuarAssistindo />

        <FileiraPorqueVoceViu />

        {/* Erro / vazio */}
        {!carregando && (isError || !temAlgo) && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
            <p className="text-base font-medium text-white">
              Não deu para carregar o catálogo
            </p>
            <p className="mt-2 text-sm text-white/45">
              A API pode estar lenta ou fora do ar. Tenta de novo em alguns
              segundos.
            </p>
            <Button
              className="mt-5 gap-2 bg-novlyx-gold text-black hover:bg-novlyx-gold/90"
              onClick={() => void refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        <FileiraConteudo
          titulo="Em Alta"
          itens={data?.emAlta}
          carregando={carregando}
          prioridade
        />
        <FileiraConteudo
          titulo="Trending BR"
          itens={data?.trendingBR}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Lançamentos da semana"
          itens={data?.lancamentosSemana}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Lancamentos"
          itens={data?.lancamentos}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Mais Populares"
          itens={data?.populares}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Recomendados"
          itens={data?.recomendados}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Adicionados Recentemente"
          itens={data?.recentes}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Acao"
          itens={data?.acao}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Drama"
          itens={data?.drama}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Comedia"
          itens={data?.comedia}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Terror"
          itens={data?.terror}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Romance"
          itens={data?.romance}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Ficcao Cientifica"
          itens={data?.ficcaoCientifica}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Documentarios"
          itens={data?.documentarios}
          carregando={carregando}
        />

        <MedidorConexao />
      </div>
    </>
  );
}
