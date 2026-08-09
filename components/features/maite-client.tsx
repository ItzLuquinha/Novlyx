"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const FRASES = [
  "Eu te amo minha branquinha linda hehe",
  "Você é o easter egg favorito desse app",
  "Se o universo fosse um catálogo, você seria o destaque 😏",
];

export function MaiteClient() {
  const [fase, setFase] = useState(0);
  const [fraseIdx, setFraseIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setFase(1), 400);
    const t2 = setTimeout(() => setFase(2), 1400);
    const t3 = setTimeout(() => setFase(3), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (fase < 3) return;
    const id = setInterval(() => {
      setFraseIdx((i) => (i + 1) % FRASES.length);
    }, 4200);
    return () => clearInterval(id);
  }, [fase]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#07070c] px-6 text-center">
      {/* fundo sutil */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-novlyx-gold/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <Link
        href="/"
        className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 backdrop-blur transition-colors hover:border-white/20 hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar
      </Link>

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        {/* coração com pulse */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={fase >= 1 ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="relative mb-8"
        >
          <motion.div
            animate={
              fase >= 2
                ? {
                    scale: [1, 1.08, 1],
                    filter: [
                      "drop-shadow(0 0 12px rgba(212,175,55,0.25))",
                      "drop-shadow(0 0 28px rgba(212,175,55,0.55))",
                      "drop-shadow(0 0 12px rgba(212,175,55,0.25))",
                    ],
                  }
                : {}
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl sm:text-7xl"
            aria-hidden
          >
            ♥
          </motion.div>
          {/* anéis */}
          {fase >= 2 && (
            <>
              <motion.span
                className="absolute inset-0 -m-4 rounded-full border border-novlyx-gold/30"
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute inset-0 -m-4 rounded-full border border-novlyx-gold/20"
                initial={{ scale: 0.6, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.6,
                }}
              />
            </>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={fase >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.35em] text-novlyx-gold/70"
        >
          só para você
        </motion.p>

        <div className="mt-4 min-h-[5.5rem] sm:min-h-[4.5rem]">
          <AnimatePresence mode="wait">
            {fase >= 3 && (
              <motion.p
                key={fraseIdx}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.55 }}
                className="bg-gradient-to-br from-novlyx-gold via-amber-200 to-novlyx-gold bg-clip-text text-2xl font-semibold leading-snug text-transparent sm:text-3xl"
              >
                {FRASES[fraseIdx]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={fase >= 3 ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 text-xs text-white/30"
        >
          pesquisou “maite” · easter egg NOVLYX
        </motion.p>
      </div>
    </main>
  );
}
