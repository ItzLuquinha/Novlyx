"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Play, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { sortearFilme } from "@/services/sorteio.service";
import { ConteudoResumo } from "@/types";
import { cn } from "@/lib/utils";

const GENEROS = [
  { id: "acao", label: "Ação", emoji: "💥" },
  { id: "comedia", label: "Comédia", emoji: "😂" },
  { id: "drama", label: "Drama", emoji: "🎭" },
  { id: "terror", label: "Terror", emoji: "👻" },
  { id: "romance", label: "Romance", emoji: "💕" },
  { id: "ficcao-cientifica", label: "Ficção", emoji: "🚀" },
  { id: "animacao", label: "Animação", emoji: "🎨" },
  { id: "aventura", label: "Aventura", emoji: "🗺️" },
  { id: "suspense", label: "Suspense", emoji: "🕵️" },
  { id: "documentario", label: "Doc", emoji: "🎥" },
];

const CLIMAS = [
  { id: "leve", label: "Algo leve", desc: "pra relaxar" },
  { id: "intensa", label: "História intensa", desc: "me prende" },
  { id: "medo", label: "Quero medo", desc: "terror/suspense" },
  { id: "chorar", label: "Pode emocionar", desc: "drama/romance" },
  { id: "surpresa", label: "Tanto faz", desc: "me surpreenda" },
];

const FAIXAS = [
  { id: "classicos", label: "Clássicos", anoMin: 1970, anoMax: 1999 },
  { id: "2000s", label: "Anos 2000", anoMin: 2000, anoMax: 2009 },
  { id: "2010s", label: "Anos 2010", anoMin: 2010, anoMax: 2019 },
  { id: "recentes", label: "Recentes", anoMin: 2020, anoMax: new Date().getFullYear() },
  { id: "qualquer", label: "Qualquer época", anoMin: 1970, anoMax: new Date().getFullYear() },
];

const DURACOES = [
  { id: "curto", label: "Curto", desc: "até ~1h30" },
  { id: "medio", label: "Médio", desc: "~2h" },
  { id: "longo", label: "Longo", desc: "épico" },
  { id: "tanto", label: "Tanto faz", desc: "" },
];

type Passo = "clima" | "genero" | "epoca" | "duracao" | "resultado";

export function SorteioClient() {
  const [passo, setPasso] = useState<Passo>("clima");
  const [clima, setClima] = useState<string | null>(null);
  const [generoId, setGeneroId] = useState<string | null>(null);
  const [faixa, setFaixa] = useState<(typeof FAIXAS)[0] | null>(null);
  const [duracao, setDuracao] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ConteudoResumo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function generoPeloClima(c: string): string {
    if (c === "medo") return "terror";
    if (c === "chorar") return "drama";
    if (c === "leve") return "comedia";
    if (c === "intensa") return "acao";
    return GENEROS[Math.floor(Math.random() * GENEROS.length)]!.id;
  }

  async function sortear(
    g: string,
    f: (typeof FAIXAS)[0],
    d: string | null
  ) {
    setCarregando(true);
    setErro(null);
    setResultado(null);
    try {
      const item = await sortearFilme({
        generoId: g,
        anoMin: f.anoMin,
        anoMax: f.anoMax,
      });
      if (!item) {
        setErro("Não achei nada com esse filtro. Tenta de novo.");
        return;
      }
      // filtro leve de duração quando a API manda nota/ano só — aceita o item
      setResultado(item);
      setPasso("resultado");
    } catch {
      setErro("Falha ao sortear. Tenta de novo.");
    } finally {
      setCarregando(false);
    }
  }

  function reiniciar() {
    setPasso("clima");
    setClima(null);
    setGeneroId(null);
    setFaixa(null);
    setDuracao(null);
    setResultado(null);
    setErro(null);
  }

  return (
    <div className="container max-w-lg py-10 sm:py-14">
      <p className="text-xs uppercase tracking-[0.2em] text-novlyx-gold/80">
        Sorteio
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Me Surpreenda</h1>
      <p className="mt-2 text-sm text-white/45">
        Responde rápido. A gente escolhe um título pra você.
      </p>

      <div className="mt-4 flex gap-1">
        {(["clima", "genero", "epoca", "duracao", "resultado"] as Passo[]).map(
          (p, i) => (
            <div
              key={p}
              className={cn(
                "h-1 flex-1 rounded-full",
                passo === p ||
                  ["clima", "genero", "epoca", "duracao", "resultado"].indexOf(
                    passo
                  ) > i
                  ? "bg-novlyx-gold"
                  : "bg-white/10"
              )}
            />
          )
        )}
      </div>

      <AnimatePresence mode="wait">
        {passo === "clima" && (
          <motion.div
            key="clima"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-3"
          >
            <p className="text-sm text-white/60">Como você está hoje?</p>
            {CLIMAS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setClima(c.id);
                  if (c.id !== "surpresa") {
                    setGeneroId(generoPeloClima(c.id));
                  }
                  setPasso("genero");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:border-novlyx-gold/40"
              >
                <span>
                  <span className="block text-sm text-white">{c.label}</span>
                  <span className="text-xs text-white/40">{c.desc}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            ))}
          </motion.div>
        )}

        {passo === "genero" && (
          <motion.div
            key="genero"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <p className="mb-3 text-sm text-white/60">Qual gênero?</p>
            <div className="grid grid-cols-2 gap-2">
              {GENEROS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGeneroId(g.id);
                    setPasso("epoca");
                  }}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                    generoId === g.id
                      ? "border-novlyx-gold/50 bg-novlyx-gold/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/25"
                  )}
                >
                  <span className="mr-1.5">{g.emoji}</span>
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
            <p className="mb-3 text-sm text-white/60">De que época?</p>
            {FAIXAS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFaixa(f);
                  setPasso("duracao");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white hover:border-novlyx-gold/40"
              >
                {f.label}
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            ))}
          </motion.div>
        )}

        {passo === "duracao" && (
          <motion.div
            key="duracao"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-2"
          >
            <p className="mb-3 text-sm text-white/60">Quanto tempo você tem?</p>
            {DURACOES.map((d) => (
              <button
                key={d.id}
                type="button"
                disabled={carregando || !generoId || !faixa}
                onClick={() => {
                  setDuracao(d.id);
                  if (generoId && faixa) void sortear(generoId, faixa, d.id);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:border-novlyx-gold/40 disabled:opacity-50"
              >
                <span>
                  <span className="block text-sm text-white">{d.label}</span>
                  {d.desc && (
                    <span className="text-xs text-white/40">{d.desc}</span>
                  )}
                </span>
                {carregando ? (
                  <Dices className="h-4 w-4 animate-spin text-novlyx-gold" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white/30" />
                )}
              </button>
            ))}
            {erro && <p className="text-sm text-rose-300">{erro}</p>}
          </motion.div>
        )}

        {passo === "resultado" && resultado && (
          <motion.div
            key="resultado"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 space-y-4"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[2/3] max-h-72 w-full sm:aspect-video sm:max-h-none">
                <Image
                  src={resultado.posterUrl}
                  alt={resultado.titulo}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white">
                  {resultado.titulo}
                </h2>
                <p className="mt-1 text-sm text-white/45">
                  {resultado.ano}
                  {resultado.nota ? ` · ★ ${resultado.nota}` : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={`/player/${resultado.id}`} className="flex-1">
                <Button className="w-full gap-2 bg-novlyx-gold text-black hover:bg-novlyx-gold/90">
                  <Play className="h-4 w-4 fill-current" /> Assistir
                </Button>
              </Link>
              <Link href={`/conteudo/${resultado.id}`} className="flex-1">
                <Button variant="outline" className="w-full border-white/15">
                  Detalhes
                </Button>
              </Link>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50"
                disabled={!generoId || !faixa}
                onClick={() => {
                  if (generoId && faixa)
                    void sortear(generoId, faixa, duracao);
                }}
              >
                <Dices className="mr-1 h-3.5 w-3.5" /> Outro
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50"
                onClick={reiniciar}
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> Recomeçar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
