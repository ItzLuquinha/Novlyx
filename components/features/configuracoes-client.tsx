"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { limparContinuarAssistindo } from "@/services/continuar-assistindo.service";
import { limparHistorico } from "@/services/historico.service";

export function ConfiguracoesClient() {
  const [avisoAds, setAvisoAds] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      setAvisoAds(localStorage.getItem("novlyx-aviso-ads-ok") !== "1");
    } catch {
      
    }
  }, []);

  function toggleAviso() {
    try {
      if (avisoAds) {
        localStorage.setItem("novlyx-aviso-ads-ok", "1");
        setAvisoAds(false);
      } else {
        localStorage.removeItem("novlyx-aviso-ads-ok");
        setAvisoAds(true);
      }
    } catch {
      
    }
  }

  function flash(texto: string) {
    setMsg(texto);
    setTimeout(() => setMsg(null), 2500);
  }

  return (
    <div className="container max-w-lg">
      <p className="text-xs uppercase tracking-[0.2em] text-novlyx-accent/80">
        Conta
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        Configurações
      </h1>
      <p className="mt-2 text-sm text-white/45">
        Preferências salvas só neste navegador.
      </p>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <div>
            <p className="text-sm font-medium text-white">Aviso de anúncios</p>
            <p className="text-xs text-white/40">
              Mostrar aviso antes de assistir
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 shrink-0 border-white/15"
            onClick={toggleAviso}
          >
            {avisoAds ? "Ligado" : "Desligado"}
          </Button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <p className="text-sm font-medium text-white">Dados locais</p>
          <p className="mt-1 text-xs text-white/40">
            Continuar assistindo e histórico ficam neste aparelho.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 border border-white/10 text-white/70"
              onClick={() => {
                limparContinuarAssistindo();
                flash("Continuar assistindo limpo");
              }}
            >
              Limpar Continuar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 border border-white/10 text-white/70"
              onClick={() => {
                limparHistorico();
                flash("Histórico limpo");
              }}
            >
              Limpar Histórico
            </Button>
          </div>
          {msg && (
            <p className="mt-3 text-xs text-novlyx-accent">{msg}</p>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-white/35">
        <Link href="/conta" className="text-novlyx-accent hover:underline">
          Gerenciar perfil
        </Link>
        {" · "}
        <Link href="/" className="hover:underline">
          Voltar
        </Link>
      </p>
    </div>
  );
}
