"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Play, RefreshCw, Sparkles } from "lucide-react";
import { ConteudoResumo } from "@/types";
import { GENEROS_FILMES } from "@/lib/mock-data/generos";
import { sortearFilme } from "@/services/sorteio.service";
import { Button } from "@/components/ui/button";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { cn } from "@/lib/utils";

type Etapa = "genero" | "ano" | "resultado";

const FAIXAS_ANO = [
  { id: "classicos", label: "Clássicos", min: 1970, max: 1999 },
  { id: "2000s", label: "Anos 2000", min: 2000, max: 2009 },
  { id: "2010s", label: "Anos 2010", min: 2010, max: 2019 },
  { id: "2020s", label: "Anos 2020", min: 2020, max: new Date().getFullYear() },
  { id: "qualquer", label: "Tanto faz", min: 1970, max: new Date().getFullYear() },
];

export function SorteioClient() {
  const [etapa, setEtapa] = useState<Etapa>("genero");
  const [generoId, setGeneroId] = useState<string | null>(null);
  const [faixa, setFaixa] = useState<(typeof FAIXAS_ANO)[number] | null>(null);
  const [resultado, setResultado] = useState<ConteudoResumo | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function sortear(
    gId: string,
    f: { min: number; max: number }
  ) {
    setCarregando(true);
    setEtapa("resultado");
    try {
      const filme = await sortearFilme({
        generoId: gId,
        anoMin: f.min,
        anoMax: f.max,
      });
      setResultado(filme);
    } finally {
      setCarregando(false);
    }
  }

  function reiniciar() {
    setEtapa("genero");
    setGeneroId(null);
    setFaixa(null);
    setResultado(null);
  }

  const generoNome =
    GENEROS_FILMES.find((g) => g.id === generoId)?.nome ?? generoId;

  return (
    <div className="container max-w-2xl py-10 sm:py-14">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-novlyx-gold/30 bg-novlyx-gold/10">
          <Dices className="h-7 w-7 text-novlyx-gold" />
        </div>
        <h1 className="text-2xl font-bold text-novlyx-white sm:text-3xl">
          Me surpreenda
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Escolhe o clima. A gente sorteia o filme.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {(["genero", "ano", "resultado"] as Etapa[]).map((e, i) => (
          <div key={e} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                etapa === e
                  ? "bg-novlyx-gold text-black"
                  : i <
                      (["genero", "ano", "resultado"] as Etapa[]).indexOf(etapa)
                    ? "bg-novlyx-gold/30 text-novlyx-gold"
                    : "bg-white/10 text-white/40"
              )}
            >
              {i + 1}
            </span>
            {i < 2 && <span className="h-px w-6 bg-white/15" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {etapa === "genero" && (
          <motion.div
            key="genero"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <p className="text-center text-sm text-white/60">
              Qual gênero você quer?
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GENEROS_FILMES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGeneroId(g.id);
                    setEtapa("ano");
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80 transition-all hover:border-novlyx-gold/40 hover:bg-novlyx-gold/10 hover:text-white"
                >
                  {g.nome}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {etapa === "ano" && (
          <motion.div
            key="ano"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <p className="text-center text-sm text-white/60">
              De que época?{" "}
              <span className="text-novlyx-gold/80">({generoNome})</span>
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FAIXAS_ANO.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFaixa(f);
                    if (generoId) void sortear(generoId, f);
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition-all hover:border-novlyx-gold/40 hover:bg-novlyx-gold/10"
                >
                  <span className="block text-sm font-medium text-white">
                    {f.label}
                  </span>
                  <span className="text-xs text-white/40">
                    {f.min} - {f.max}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEtapa("genero")}
              className="mx-auto block text-xs text-white/40 hover:text-white/70"
            >
              ← voltar
            </button>
          </motion.div>
        )}

        {etapa === "resultado" && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {carregando && (
              <div className="flex flex-col items-center gap-3 py-16">
                <Sparkles className="h-8 w-8 animate-pulse text-novlyx-gold" />
                <p className="text-sm text-white/50">Sorteando seu filme…</p>
              </div>
            )}

            {!carregando && !resultado && (
              <div className="space-y-4 py-12 text-center">
                <p className="text-white/60">
                  Não achamos nada com esse filtro. Tenta de novo?
                </p>
                <Button onClick={reiniciar} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Recomeçar
                </Button>
              </div>
            )}

            {!carregando && resultado && (
              <>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={resultado.bannerUrl || resultado.posterUrl}
                      alt={resultado.titulo}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[11px] uppercase tracking-widest text-novlyx-gold/80">
                        Seu filme
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                        {resultado.titulo}
                      </h2>
                      <p className="mt-1 text-sm text-white/50">
                        {resultado.ano}
                        {resultado.nota > 0 ? ` · ★ ${resultado.nota}` : ""}
                        {resultado.qualidade
                          ? ` · ${resultado.qualidade}`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Link href={`/player/${resultado.id}`} className="sm:flex-1">
                    <Button className="w-full gap-2 bg-novlyx-gold text-black hover:bg-novlyx-gold/90">
                      <Play className="h-4 w-4 fill-current" />
                      Assistir agora
                    </Button>
                  </Link>
                  <Link href={`/conteudo/${resultado.id}`} className="sm:flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-white/15 text-white hover:bg-white/5"
                    >
                      Ver detalhes
                    </Button>
                  </Link>
                </div>

                <div className="flex justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-white/50 hover:text-white"
                    disabled={!generoId || !faixa}
                    onClick={() => {
                      if (generoId && faixa) void sortear(generoId, faixa);
                    }}
                  >
                    <Dices className="h-3.5 w-3.5" />
                    Outro com mesmo filtro
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-white/50 hover:text-white"
                    onClick={reiniciar}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Recomeçar
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
