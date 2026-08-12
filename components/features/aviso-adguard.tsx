"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "novlyx-adguard-ok";

function detectarMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(ua);
}

function detectarIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

export function AvisoAdguard() {
  const [aberto, setAberto] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    setMobile(detectarMobile());
    setIos(detectarIOS());
    setAberto(true);
  }, []);

  function confirmar() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setAberto(false);
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adguard-titulo"
    >
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-novlyx-graphite p-5 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-novlyx-accent">
          Antes de continuar
        </p>
        <h2 id="adguard-titulo" className="mt-2 text-lg font-semibold text-white">
          Use um bloqueador de anuncios
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          As fontes de video sao externas e podem mostrar anuncios, pop-ups ou
          conteudo +18. A NOVLYX nao controla isso. Recomendamos o{" "}
          <strong className="text-white/80">AdGuard</strong> (ou outro bloqueador)
          para uma experiencia mais segura.
        </p>

        <div className="mt-4 rounded-md border border-white/8 bg-black/30 p-3 text-sm text-white/70">
          {mobile ? (
            ios ? (
              <div className="space-y-2">
                <p className="font-medium text-white">No iPhone / iPad</p>
                <ol className="list-decimal space-y-1.5 pl-4 text-xs text-white/55">
                  <li>
                    Abra a App Store e instale{" "}
                    <span className="text-white/80">AdGuard</span> (bloqueador
                    de conteudo).
                  </li>
                  <li>
                    Em Ajustes do iOS, va em Safari → Extensoes e ative o AdGuard.
                  </li>
                  <li>
                    Volte ao Safari e recarregue a NOVLYX.
                  </li>
                </ol>
                <a
                  href="https://apps.apple.com/app/adguard/id1047223162"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-novlyx-accent hover:underline"
                >
                  Abrir AdGuard na App Store
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-medium text-white">No Android</p>
                <ol className="list-decimal space-y-1.5 pl-4 text-xs text-white/55">
                  <li>
                    Instale o app{" "}
                    <span className="text-white/80">AdGuard</span> na Play Store
                    ou use a extensao no Chrome/Firefox.
                  </li>
                  <li>Ative a protecao / bloqueio de anuncios.</li>
                  <li>Recarregue a NOVLYX.</li>
                </ol>
                <a
                  href="https://adguard.com/adguard-android/overview.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-novlyx-accent hover:underline"
                >
                  Site oficial AdGuard Android
                </a>
              </div>
            )
          ) : (
            <div className="space-y-2">
              <p className="font-medium text-white">No computador</p>
              <ol className="list-decimal space-y-1.5 pl-4 text-xs text-white/55">
                <li>
                  Instale a extensao{" "}
                  <span className="text-white/80">AdGuard</span> no Chrome,
                  Firefox, Edge ou Safari.
                </li>
                <li>Ative a extensao e permita no site da NOVLYX.</li>
                <li>Recarregue a pagina.</li>
              </ol>
              <a
                href="https://adguard.com/adguard-browser-extension/overview.html"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-novlyx-accent hover:underline"
              >
                Baixar extensao AdGuard
              </a>
            </div>
          )}
        </div>

        <p className="mt-3 text-[11px] text-white/35">
          Voce pode continuar sem bloqueador, mas anuncios das fontes externas
          podem aparecer.
        </p>

        <button
          type="button"
          onClick={confirmar}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-md bg-novlyx-accent text-sm font-semibold text-white hover:bg-novlyx-accent-soft"
        >
          Entendi, continuar
        </button>
      </div>
    </div>
  );
}
