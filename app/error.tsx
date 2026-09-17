"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold text-white">Algo deu errado</h2>
      <p className="max-w-md text-sm text-white/60">
        {error?.message || "Erro inesperado ao carregar a pagina."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
      >
        Tentar de novo
      </button>
    </div>
  );
}
