"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
    try {
      const log = (window as unknown as { __novlyxLog?: (n: string, m: string, e?: string) => void }).__novlyxLog;
      log?.("error", error.message, error.stack);
    } catch {
      /* ignore */
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold text-white">Erro na pagina</h2>
      <pre className="max-w-xl whitespace-pre-wrap break-all rounded-lg bg-red-950/40 p-4 text-left text-xs text-red-200">
        {error?.message || "Erro desconhecido"}
        {error?.digest ? `\ndigest: ${error.digest}` : ""}
        {error?.stack ? `\n\n${error.stack}` : ""}
      </pre>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
        >
          Tentar de novo
        </button>
        <a href="/debug" className="rounded-md bg-violet-600/80 px-4 py-2 text-sm text-white">
          Abrir /debug
        </a>
      </div>
    </div>
  );
}
