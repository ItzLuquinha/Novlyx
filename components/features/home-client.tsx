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

      <div
        className={
          (data?.destaques?.length ?? 0) > 0
            ? "container relative z-10 -mt-2 flex flex-col gap-9 pb-20 sm:-mt-4 sm:gap-11"
            : "container relative z-10 flex flex-col gap-9 pb-20 pt-24 sm:gap-11"
        }
      >
        <Link
          href="/sorteio"
          className="group flex items-center gap-3 rounded-md border border-white/8 bg-novlyx-graphite px-4 py-3.5 transition-colors hover:border-novlyx-accent/40 hover:bg-novlyx-graphite-light"
        >
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-white group-hover:text-novlyx-accent sm:text-base">
              Me Surpreenda
            </p>
            <p className="text-xs text-white/40">
              Nao sabe o que assistir? Escolha genero e ano. A gente sorteia.
            </p>
          </div>
          <span className="hidden text-xs text-novlyx-accent/70 sm:inline">
            Sortear
          </span>
        </Link>

        <FileiraContinuarAssistindo />

        <FileiraPorqueVoceViu />

        {!carregando && (isError || !temAlgo) && (
          <div className="rounded-md border border-white/8 bg-novlyx-graphite px-6 py-10 text-center">
            <p className="text-base font-medium text-white">
              Nao deu para carregar o catalogo
            </p>
            <p className="mt-2 text-sm text-white/45">
              A API pode estar lenta ou fora do ar. Tenta de novo em alguns
              segundos.
            </p>
            <Button
              variant="accent"
              className="mt-5 gap-2"
              onClick={() => void refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        <FileiraConteudo
          titulo="Em alta"
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
          titulo="Lancamentos da semana"
          itens={data?.lancamentosSemana}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Lancamentos"
          itens={data?.lancamentos}
          carregando={carregando}
        />
        <FileiraConteudo
          titulo="Mais populares"
          itens={data?.populares}
          carregando={carregando}
        />

        <MedidorConexao />
      </div>
    </>
  );
}
