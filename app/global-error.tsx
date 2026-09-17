"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#09090b", color: "#fff", fontFamily: "system-ui", padding: 24 }}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Erro global NOVLYX</h1>
        <pre
          style={{
            background: "#450a0a",
            padding: 16,
            borderRadius: 8,
            fontSize: 12,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {error?.message}
          {error?.digest ? `\ndigest: ${error.digest}` : ""}
          {error?.stack ? `\n\n${error.stack}` : ""}
        </pre>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            background: "#7c3aed",
            border: "none",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Tentar de novo
        </button>
        <p style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>
          Abra /debug se conseguir carregar alguma pagina.
        </p>
      </body>
    </html>
  );
}
