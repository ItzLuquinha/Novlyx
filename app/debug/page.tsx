"use client";

import { useEffect, useState } from "react";

interface Resultado {
  nome: string;
  ok: boolean;
  detalhe: string;
}

export default function PaginaDebug() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [rodando, setRodando] = useState(true);
  const [erroGlobal, setErroGlobal] = useState<string | null>(null);

  useEffect(() => {
    const out: Resultado[] = [];

    function add(nome: string, ok: boolean, detalhe: string) {
      out.push({ nome, ok, detalhe });
      setResultados([...out]);
    }

    (async () => {
      try {
        add("Window", true, typeof window !== "undefined" ? window.location.href : "ssr");
        add("UserAgent", true, navigator.userAgent.slice(0, 120));

        // Buffer check (historical bug)
        add(
          "Buffer no browser",
          typeof Buffer === "undefined",
          typeof Buffer === "undefined"
            ? "OK: Buffer nao existe no browser (esperado)"
            : "Buffer existe (raro no browser)"
        );

        // Health
        try {
          const r = await fetch("/api/debug/health", { cache: "no-store" });
          const j = await r.json();
          add("GET /api/debug/health", r.ok, JSON.stringify(j, null, 2));
        } catch (e) {
          add("GET /api/debug/health", false, String(e));
        }

        // Proxy routes
        for (const [nome, path] of [
          ["Proxy trending", "/api/proxy/trending?time_window=day&page=1"],
          ["Proxy trendingtv", "/api/proxy/trendingtv?time_window=week&page=1"],
          ["Proxy TV One Piece", "/api/proxy/tv?tmdb_id=37854"],
          ["Proxy movie sample", "/api/proxy/movie?tmdb_id=550"],
        ] as const) {
          try {
            const r = await fetch(path, { cache: "no-store" });
            const text = await r.text();
            let sample = text.slice(0, 200);
            try {
              const j = JSON.parse(text);
              sample = JSON.stringify({
                keys: Object.keys(j).slice(0, 8),
                name: j.name || j.title || j.results?.[0]?.name || j.results?.[0]?.title,
                tmdb_id: j.tmdb_id || j.results?.[0]?.tmdb_id,
              });
            } catch {
              /* keep sample */
            }
            add(nome, r.ok, `status=${r.status} bytes=${text.length} ${sample}`);
          } catch (e) {
            add(nome, false, String(e));
          }
        }

        // Client mapear
        try {
          const { mapearDetalhe } = await import("@/lib/adapters/2embed");
          const r = await fetch("/api/proxy/tv?tmdb_id=37854", { cache: "no-store" });
          const item = await r.json();
          const det = mapearDetalhe(item, "anime");
          add(
            "mapearDetalhe(anime)",
            Boolean(det?.idInterno && det?.titulo),
            JSON.stringify({
              id: det.id,
              idInterno: det.idInterno,
              tmdbId: det.tmdbId,
              imdbId: det.imdbId,
              titulo: det.titulo,
              temps: det.temporadas?.length,
              categoria: det.categoria,
            })
          );
        } catch (e) {
          add("mapearDetalhe(anime)", false, e instanceof Error ? `${e.message}\n${e.stack}` : String(e));
        }

        // Placeholder (Buffer bug)
        try {
          const { gerarPosterPlaceholder } = await import("@/utils/placeholder");
          const url = gerarPosterPlaceholder("Teste Debug");
          add(
            "gerarPosterPlaceholder",
            url.startsWith("data:image"),
            url.slice(0, 80) + "..."
          );
        } catch (e) {
          add("gerarPosterPlaceholder", false, e instanceof Error ? `${e.message}\n${e.stack}` : String(e));
        }
      } catch (e) {
        setErroGlobal(e instanceof Error ? e.message : String(e));
      } finally {
        setRodando(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">NOVLYX Debug</h1>
        <p className="text-sm text-white/50">
          Esta pagina testa APIs, proxy, mapper e utilitarios. Abra tambem o botao{" "}
          <strong>Debug</strong> no canto inferior direito em qualquer pagina.
        </p>
        {rodando ? <p className="text-sm text-violet-300">Rodando testes...</p> : null}
        {erroGlobal ? (
          <pre className="rounded-lg bg-red-950/50 p-3 text-xs text-red-300">{erroGlobal}</pre>
        ) : null}
        <div className="space-y-2">
          {resultados.map((r) => (
            <div
              key={r.nome}
              className={`rounded-lg border p-3 ${
                r.ok ? "border-emerald-500/30 bg-emerald-950/20" : "border-red-500/40 bg-red-950/30"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span>{r.ok ? "OK" : "FALHOU"}</span>
                <span>{r.nome}</span>
              </div>
              <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-[11px] text-white/60">
                {r.detalhe}
              </pre>
            </div>
          ))}
        </div>
        <a href="/" className="inline-block text-sm text-violet-300 underline">
          Voltar ao inicio
        </a>
      </div>
    </main>
  );
}
