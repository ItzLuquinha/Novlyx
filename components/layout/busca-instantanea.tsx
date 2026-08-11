"use client";

import { useEffect, useRef, useState } from "react";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import Link from "next/link";
import { Search, X, Loader2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBusca } from "@/hooks/use-busca";
import { cn } from "@/lib/utils";
import { formatarNota } from "@/utils/formatadores";

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function BuscaInstantanea() {
  const [aberta, setAberta] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useBusca(query);

  const ehMaite = normalizarTexto(query) === "maite";

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(evento.target as Node)
      ) {
        setAberta(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  const temResultados =
    data &&
    (data.filmes.length > 0 ||
      data.series.length > 0 ||
      data.animes.length > 0 ||
      data.doramas.length > 0 ||
      data.canais.length > 0 ||
      data.eventos.length > 0);

  const todosItens = data
    ? [...data.filmes, ...data.series, ...data.animes, ...data.doramas].slice(0, 8)
    : [];

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 transition-all",
          aberta && "border-novlyx-accent/40 bg-white/10"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-novlyx-gray-light" />
        <input
          type="text"
          placeholder="Pesquisar filmes, series, canais..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setAberta(true)}
          className="w-full min-w-0 flex-1 bg-transparent text-sm text-novlyx-white placeholder:text-novlyx-gray-light outline-none sm:w-48 sm:focus:w-72"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpar pesquisa"
            className="text-novlyx-gray-light hover:text-novlyx-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {aberta && query.trim().length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-3 w-full max-w-[100vw] overflow-hidden rounded-lg border border-white/10 bg-novlyx-graphite shadow-2xl sm:left-auto sm:right-0 sm:w-[26rem]"
          >
            {ehMaite && (
              <Link
                href="/maite"
                onClick={() => setAberta(false)}
                className="flex flex-col items-center justify-center gap-3 p-8 text-center transition-colors hover:bg-white/[0.03]"
              >
                <Heart className="h-10 w-10 fill-novlyx-accent text-novlyx-accent drop-shadow-[0_0_16px_rgba(212,175,55,0.45)]" />
                <p className="bg-accent-gradient bg-clip-text text-base font-semibold text-transparent">
                  Eu te amo minha branquinha linda hehe
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  abrir surpresa
                </p>
              </Link>
            )}

            {!ehMaite && isLoading && (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-novlyx-gray-light">
                <Loader2 className="h-4 w-4 animate-spin" />
                Pesquisando...
              </div>
            )}

            {!ehMaite && !isLoading && !temResultados && (
              <div className="p-6 text-center text-sm text-novlyx-gray-light">
                Nenhum resultado encontrado para &quot;{query}&quot;
              </div>
            )}

            {!ehMaite && !isLoading && temResultados && (
              <ul className="max-h-96 overflow-y-auto py-2">
                {todosItens.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/conteudo/${item.id}`}
                      onClick={() => setAberta(false)}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded">
                        <Image
                          src={item.posterUrl}
                          alt={item.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-novlyx-white">
                          {item.titulo}
                        </p>
                        <p className="text-xs text-novlyx-gray-light">
                          {item.ano} • Nota {formatarNota(item.nota)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}

                {data && data.canais.length > 0 && (
                  <>
                    <li className="px-4 pb-1 pt-2 text-xs font-semibold uppercase text-novlyx-gray-light">
                      Canais
                    </li>
                    {data.canais.slice(0, 3).map((canal) => (
                      <li key={canal.id}>
                        <Link
                          href="/tv-ao-vivo"
                          onClick={() => setAberta(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-novlyx-white hover:bg-white/5"
                        >
                          {canal.nome}
                        </Link>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            )}

            {!ehMaite && (
              <div className="border-t border-white/10 p-2">
                <Link
                  href={`/busca?q=${encodeURIComponent(query)}`}
                  onClick={() => setAberta(false)}
                  className="block rounded-md px-3 py-2 text-center text-sm font-medium text-novlyx-accent hover:bg-white/5"
                >
                  Ver todos os resultados
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
