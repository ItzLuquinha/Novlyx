import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoNovlyx } from "@/components/shared/logo-novlyx";

export default function NaoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoNovlyx tamanho="md" />
      <div>
        <p className="text-6xl font-bold text-novlyx-accent">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-novlyx-white">
          Conteudo nao encontrado
        </h1>
        <p className="mt-2 max-w-md text-novlyx-gray-light">
          A pagina que voce esta procurando nao existe ou foi removida do
          catalogo.
        </p>
      </div>
      <Button variant="accent" size="lg" asChild>
        <Link href="/">Voltar ao inicio</Link>
      </Button>
    </main>
  );
}
