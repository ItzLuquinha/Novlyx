"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoNovlyx } from "@/components/shared/logo-novlyx";

export default function ErroGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoNovlyx tamanho="md" />
      <div className="flex flex-col items-center gap-3">
        <AlertTriangle className="h-10 w-10 text-novlyx-accent" />
        <h1 className="text-2xl font-semibold text-novlyx-white">
          Algo deu errado
        </h1>
        <p className="max-w-md text-novlyx-gray-light">
          Ocorreu um erro inesperado ao carregar esta pagina. Tente novamente
          em instantes.
        </p>
      </div>
      <Button variant="accent" size="lg" onClick={reset}>
        Tentar novamente
      </Button>
    </main>
  );
}
