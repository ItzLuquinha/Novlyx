"use client";

import { useCallback, useEffect, useState } from "react";

type LogNivel = "info" | "warn" | "error" | "ok";

interface LogItem {
  id: number;
  ts: string;
  nivel: LogNivel;
  msg: string;
  extra?: string;
}

const MAX = 80;

function agora() {
  return new Date().toLocaleTimeString("pt-BR", { hour12: false });
}

export function DebugConsole() {
  const [aberto, setAberto] = useState(false);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [seq, setSeq] = useState(0);

  const add = useCallback((nivel: LogNivel, msg: string, extra?: string) => {
    setSeq((s) => {
      const id = s + 1;
      setLogs((prev) => {
        const next = [
          ...prev,
          { id, ts: agora(), nivel, msg, extra: extra?.slice(0, 2000) },
        ];
        return next.length > MAX ? next.slice(next.length - MAX) : next;
      });
      return id;
    });
  }, []);

  useEffect(() => {
    // expose global logger
    (window as unknown as { __novlyxLog?: typeof add }).__novlyxLog = add;
    add("info", "Debug console ativo", `href=${window.location.href}`);

    function onError(ev: ErrorEvent) {
      add(
        "error",
        `window.onerror: ${ev.message}`,
        `${ev.filename}:${ev.lineno}:${ev.colno}\n${ev.error?.stack || ""}`
      );
    }
    function onRejection(ev: PromiseRejectionEvent) {
      const reason = ev.reason;
      const msg =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : JSON.stringify(reason);
      add("error", `unhandledrejection: ${msg}`, reason?.stack || "");
    }
    function onConsoleError(...args: unknown[]) {
      add("error", "console.error", args.map(String).join(" "));
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    const original = console.error;
    console.error = (...args: unknown[]) => {
      onConsoleError(...args);
      original.apply(console, args);
    };

    // self-tests (somente desenvolvimento — nao competir com a home em producao)
    if (process.env.NODE_ENV === "production") return;
    (async () => {
      try {
        const r = await fetch("/api/debug/health", { cache: "no-store" });
        const j = await r.json().catch(() => ({}));
        if (r.ok) add("ok", "API health OK", JSON.stringify(j));
        else add("error", `API health ${r.status}`, JSON.stringify(j));
      } catch (e) {
        add("error", "API health falhou", String(e));
      }

      try {
        const r = await fetch("/api/proxy/trending?time_window=day&page=1", {
          cache: "no-store",
        });
        const text = await r.text();
        if (r.ok) {
          add("ok", "Proxy trending OK", `status=${r.status} bytes=${text.length}`);
        } else {
          add("error", `Proxy trending ${r.status}`, text.slice(0, 500));
        }
      } catch (e) {
        add("error", "Proxy trending falhou", String(e));
      }

      try {
        const r = await fetch("/api/proxy/tv?tmdb_id=37854", { cache: "no-store" });
        const text = await r.text();
        if (r.ok) {
          add("ok", "Proxy TV (One Piece) OK", `status=${r.status} bytes=${text.length}`);
        } else {
          add("error", `Proxy TV ${r.status}`, text.slice(0, 500));
        }
      } catch (e) {
        add("error", "Proxy TV falhou", String(e));
      }
    })();

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      console.error = original;
    };
  }, [add]);

  const cor: Record<LogNivel, string> = {
    info: "text-white/70",
    warn: "text-yellow-300",
    error: "text-red-400",
    ok: "text-emerald-400",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="fixed bottom-3 right-3 z-[9999] rounded-full bg-black/90 px-3 py-2 text-xs font-medium text-white shadow-lg ring-1 ring-white/20 hover:bg-black"
        aria-label="Abrir console debug"
      >
        {aberto ? "Fechar debug" : "Debug"}
        {logs.some((l) => l.nivel === "error") ? (
          <span className="ml-1 inline-block h-2 w-2 rounded-full bg-red-500" />
        ) : null}
      </button>

      {aberto ? (
        <div className="fixed bottom-14 right-3 z-[9999] flex max-h-[70vh] w-[min(96vw,420px)] flex-col overflow-hidden rounded-xl border border-white/15 bg-zinc-950/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <span className="text-xs font-semibold text-white">NOVLYX Debug</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-[10px] text-white/50 hover:text-white"
                onClick={() => setLogs([])}
              >
                Limpar
              </button>
              <a href="/debug" className="text-[10px] text-violet-300 hover:underline">
                Pagina /debug
              </a>
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2 font-mono text-[10px] leading-relaxed">
            {logs.length === 0 ? (
              <p className="text-white/40">Sem logs ainda...</p>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="rounded bg-white/5 px-2 py-1">
                  <div className={cor[l.nivel]}>
                    <span className="text-white/30">{l.ts}</span> [{l.nivel}] {l.msg}
                  </div>
                  {l.extra ? (
                    <pre className="mt-0.5 whitespace-pre-wrap break-all text-white/40">
                      {l.extra}
                    </pre>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
