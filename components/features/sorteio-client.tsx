"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConteudoResumo } from "@/types";
import { sortearFilmes } from "@/services/sorteio.service";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { formatarNota } from "@/utils/formatadores";
import { cn } from "@/lib/utils";

const GENEROS = [
  { id: "acao", label: "Acao" },
  { id: "comedia", label: "Comedia" },
  { id: "drama", label: "Drama" },
  { id: "terror", label: "Terror" },
  { id: "romance", label: "Romance" },
  { id: "ficcao-cientifica", label: "Ficcao" },
  { id: "animacao", label: "Animacao" },
  { id: "aventura", label: "Aventura" },
  { id: "suspense", label: "Suspense" },
  { id: "documentario", label: "Documentario" },
];

const FAIXAS = [
  { id: "classicos", label: "Classicos", sub: "1970-1999", anoMin: 1970, anoMax: 1999 },
  { id: "2000s", label: "Anos 2000", sub: "2000-2009", anoMin: 2000, anoMax: 2009 },
  { id: "2010s", label: "Anos 2010", sub: "2010-2019", anoMin: 2010, anoMax: 2019 },
  { id: "recentes", label: "Recentes", sub: "2020+", anoMin: 2020, anoMax: new Date().getFullYear() },
  { id: "qualquer", label: "Qualquer epoca", sub: "Todas", anoMin: 1970, anoMax: new Date().getFullYear() },
];

const TEMPOS = [
  { id: "curto" as const, label: "Curto", sub: "ate ~1h30" },
  { id: "medio" as const, label: "Medio", sub: "~2h" },
  { id: "longo" as const, label: "Longo", sub: "epico" },
  { id: "qualquer" as const, label: "Tanto faz", sub: "qualquer" },
];

const NOTAS = [
  { valor: 0, label: "Qualquer" },
  { valor: 6, label: "6+" },
  { valor: 7, label: "7+" },
  { valor: 8, label: "8+" },
  { valor: 8.5, label: "8.5+" },
];

type Passo = "genero" | "epoca" | "tempo" | "nota" | "resultado";

export function SorteioClient() {
  const [passo, setPasso] = useState<Passo>("genero");
  const [generoId, setGeneroId] = useState<string | null>(null);
  const [faixa, setFaixa] = useState<(typeof FAIXAS)[0] | null>(null);
  const [tempo, setTempo] = useState<(typeof TEMPOS)[number]["id"] | null>(null);
  const [notaMin, setNotaMin] = useState<number | null>(null);
  const [resultados, setResultados] = useState<ConteudoResumo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const passos: Passo[] = ["genero", "epoca", "tempo", "nota", "resultado"];
  const idx = passos.indexOf(passo);

  async function executar(
    g: string,
    f: (typeof FAIXAS)[0],
    t: (typeof TEMPOS)[number]["id"],
    n: number
  ) {
    setCarregando(true);
    setErro(null);
    setResultados([]);
    try {
      const lista = await sortearFilmes({
        generoId: g,
        anoMin: f.anoMin,
        anoMax: f.anoMax,
        notaMinima: n,
        duracao: t,
        quantidade: 3,
      });
      if (lista.length === 0) {
        setErro("Nao achei titulos com esse filtro. Tenta outro genero, epoca mais ampla ou nota menor.");
        setPasso("resultado");
        return;
      }
      setResultados(lista);
      setPasso("resultado");
    } catch {
      setErro("Falha na busca. Verifica a conexao e tenta de novo.");
      setPasso("resultado");
    } finally {
      setCarregando(false);
    }
  }

  function reiniciar() {
    setPasso("genero");
    setGeneroId(null);
    setFaixa(null);
    setTempo(null);
    setNotaMin(null);
    setResultados([]);
    setErro(null);
  }

  return (
    <div className="container max-w-2xl py-8 sm:py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-novlyx-accent/80">
        Sorteio
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Me Surpreenda</h1>
      <p className="mt-2 text-sm text-white/45">
        Genero, epoca, tempo e nota. Voce recebe 3 opcoes.
      </p>

      <div className="mt-5 flex gap-1">
        {passos.map((p, i) => (
          <div
            key={p}
            className={cn(
              "h-1 flex-1 rounded-full",
              i <= idx ? "bg-novlyx-accent" : "bg-white/10"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {passo === "genero" && (
          <motion.div
            key="genero"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <p className="mb-1 text-sm font-medium text-white">Genero</p>
            <p className="mb-4 text-xs text-white/40">Qual tipo de filme?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GENEROS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGeneroId(g.id);
                    setPasso("epoca");
                  }}
                  className={cn(
                    "rounded-md border px-3 py-3 text-left text-sm transition-colors",
                    generoId === g.id
                      ? "border-novlyx-accent/50 bg-novlyx-accent/10 text-white"
                      : "border-white/10 bg-novlyx-graphite text-white/80 hover:border-white/20"
                  )}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {passo === "epoca" && (
          <motion.div
            key="epoca"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-2"
          >
            <p className="mb-1 text-sm font-medium text-white">Epoca</p>
            <p className="mb-4 text-xs text-white/40">De que anos?</p>
            {FAIXAS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFaixa(f);
                  setPasso("tempo");
                }}
                className="flex w-full items-center justify-between rounded-md border border-white/10 bg-novlyx-graphite px-4 py-3 text-left hover:border-novlyx-accent/40"
              >
                <span className="text-sm text-white">{f.label}</span>
                <span className="text-xs text-white/40">{f.sub}</span>
              </button>
            ))}
            <button
              type="button"
              className="mt-2 text-xs text-white/40 hover:text-white"
              onClick={() => setPasso("genero")}
            >
              Voltar
            </button>
          </motion.div>
        )}

        {passo === "tempo" && (
          <motion.div
            key="tempo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-2"
          >
            <p className="mb-1 text-sm font-medium text-white">Tempo</p>
            <p className="mb-4 text-xs text-white/40">
              Quanto tempo voce tem? (aproximado)
            </p>
            {TEMPOS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTempo(t.id);
                  setPasso("nota");
                }}
                className="flex w-full items-center justify-between rounded-md border border-white/10 bg-novlyx-graphite px-4 py-3 text-left hover:border-novlyx-accent/40"
              >
                <span className="text-sm text-white">{t.label}</span>
                <span className="text-xs text-white/40">{t.sub}</span>
              </button>
            ))}
            <button
              type="button"
              className="mt-2 text-xs text-white/40 hover:text-white"
              onClick={() => setPasso("epoca")}
            >
              Voltar
            </button>
          </motion.div>
        )}

        {passo === "nota" && (
          <motion.div
            key="nota"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <p className="mb-1 text-sm font-medium text-white">
              Minimo de estrelas
            </p>
            <p className="mb-4 text-xs text-white/40">Nota minima do filme</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {NOTAS.map((n) => (
                <button
                  key={n.valor}
                  type="button"
                  disabled={carregando || !generoId || !faixa || !tempo}
                  onClick={() => {
                    setNotaMin(n.valor);
                    if (generoId && faixa && tempo) {
                      void executar(generoId, faixa, tempo, n.valor);
                    }
                  }}
                  className="rounded-md border border-white/10 bg-novlyx-graphite px-3 py-3 text-sm text-white hover:border-novlyx-accent/40 disabled:opacity-50"
                >
                  {n.label}
                </button>
              ))}
            </div>
            {carregando && (
              <p className="mt-4 text-center text-sm text-white/45">
                Sorteando 3 filmes...
              </p>
            )}
            <button
              type="button"
              className="mt-4 text-xs text-white/40 hover:text-white"
              onClick={() => setPasso("tempo")}
              disabled={carregando}
            >
              Voltar
            </button>
          </motion.div>
        )}

        {passo === "resultado" && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-5"
          >
            <div>
              <p className="text-sm font-medium text-white">Suas 3 opcoes</p>
              <p className="mt-1 text-xs text-white/40">
                {[
                  GENEROS.find((g) => g.id === generoId)?.label,
                  faixa?.label,
                  TEMPOS.find((t) => t.id === tempo)?.label,
                  notaMin != null && notaMin > 0 ? `${notaMin}+` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            {erro && (
              <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {erro}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              {resultados.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-md border border-white/10 bg-novlyx-graphite"
                >
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={item.posterUrl}
                      alt={item.titulo}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="line-clamp-2 text-sm font-medium text-white">
                      {item.titulo}
                    </h2>
                    <p className="mt-1 text-xs text-white/45">
                      {item.ano}
                      {item.nota ? ` · ${formatarNota(item.nota)}` : ""}
                    </p>
                    <div className="mt-3 flex flex-col gap-1.5">
                      <Link
                        href={`/player/${item.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-novlyx-accent text-xs font-semibold text-white hover:bg-novlyx-accent-soft"
                      >
                        Assistir
                      </Link>
                      <Link
                        href={`/conteudo/${item.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-md border border-white/10 text-xs text-white/70 hover:bg-white/5"
                      >
                        Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={carregando || !generoId || !faixa || !tempo || notaMin == null}
                onClick={() => {
                  if (generoId && faixa && tempo && notaMin != null) {
                    void executar(generoId, faixa, tempo, notaMin);
                  }
                }}
                className="text-sm text-novlyx-accent hover:underline disabled:opacity-40"
              >
                Sortear de novo
              </button>
              <button
                type="button"
                onClick={reiniciar}
                className="text-sm text-white/40 hover:text-white"
              >
                Recomecar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
