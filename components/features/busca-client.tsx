"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBusca } from "@/hooks/use-busca";
import { CardConteudo } from "@/components/shared/card-conteudo";
import { CardCanal } from "@/components/shared/card-canal";
import { CardEvento } from "@/components/shared/card-evento";
import { Skeleton } from "@/components/ui/skeleton";

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function BuscaClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const { data, isLoading } = useBusca(query);

  const ehMaite = normalizarTexto(query) === "maite";

  const totalResultados =
    (data?.filmes.length ?? 0) +
    (data?.series.length ?? 0) +
    (data?.animes.length ?? 0) +
    (data?.doramas.length ?? 0) +
    (data?.canais.length ?? 0) +
    (data?.eventos.length ?? 0);

  return (
    <div className="container py-10 sm:py-14">
      <div className="relative mb-10 max-w-xl">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-novlyx-gray-light" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar filmes, series, animes, doramas, canais..."
          className="h-14 pl-12 text-base"
          autoFocus
        />
      </div>

      {ehMaite && (
        <button
          type="button"
          onClick={() => router.push("/maite")}
          className="group flex w-full flex-col items-center justify-center gap-5 rounded-2xl border border-novlyx-gold/20 bg-white/[0.03] py-20 text-center transition-all hover:border-novlyx-gold/40 hover:bg-white/[0.05]"
        >
          <Heart className="h-14 w-14 fill-novlyx-gold text-novlyx-gold drop-shadow-[0_0_24px_rgba(212,175,55,0.45)] transition-transform duration-500 group-hover:scale-110" />
          <div>
            <p className="bg-gold-gradient bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl">
              Eu te amo minha branquinha linda hehe
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/35 transition-colors group-hover:text-novlyx-gold/70">
              toque para abrir
            </p>
          </div>
        </button>
      )}

      {!ehMaite && isLoading && query.trim().length > 1 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
          ))}
        </div>
      )}

      {!ehMaite && !isLoading && query.trim().length > 1 && totalResultados === 0 && (
        <p className="py-20 text-center text-novlyx-gray-light">
          Nenhum resultado encontrado para &quot;{query}&quot;
        </p>
      )}

      {!ehMaite && !isLoading && data && totalResultados > 0 && (
        <div className="flex flex-col gap-10">
          {[
            { titulo: "Filmes", itens: data.filmes },
            { titulo: "Series", itens: data.series },
            { titulo: "Animes", itens: data.animes },
            { titulo: "Doramas", itens: data.doramas },
          ].map(
            (grupo) =>
              grupo.itens.length > 0 && (
                <section key={grupo.titulo}>
                  <h2 className="mb-3 text-lg font-semibold text-novlyx-white">
                    {grupo.titulo}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {grupo.itens.map((item) => (
                      <CardConteudo key={item.id} conteudo={item} />
                    ))}
                  </div>
                </section>
              )
          )}

          {data.canais.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-novlyx-white">
                Canais
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {data.canais.map((canal) => (
                  <CardCanal
                    key={canal.id}
                    canal={canal}
                    onSelecionar={() => router.push("/tv-ao-vivo")}
                  />
                ))}
              </div>
            </section>
          )}

          {data.eventos.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-novlyx-white">
                Eventos Esportivos
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.eventos.map((evento) => (
                  <CardEvento key={evento.id} evento={evento} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {!ehMaite && query.trim().length <= 1 && (
        <p className="py-20 text-center text-novlyx-gray-light">
          Digite ao menos 2 caracteres para pesquisar
        </p>
      )}
    </div>
  );
}
