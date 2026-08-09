import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function PaginaLegal({
  titulo,
  atualizado,
  children,
}: {
  titulo: string;
  atualizado: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 lg:pt-24">
        <article className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-novlyx-gold/80">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-novlyx-white sm:text-4xl">
            {titulo}
          </h1>
          <p className="mt-2 text-sm text-novlyx-gray-light">
            Última atualização: {atualizado}
          </p>

          <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-white/70">
            {children}
          </div>

          <p className="mt-12 text-xs text-white/40">
            Voltar para{" "}
            <Link href="/" className="text-novlyx-gold hover:underline">
              início
            </Link>
            {" · "}
            <Link href="/termos" className="text-novlyx-gold hover:underline">
              Termos
            </Link>
            {" · "}
            <Link
              href="/privacidade"
              className="text-novlyx-gold hover:underline"
            >
              Privacidade
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}

export function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-novlyx-white">
        {titulo}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
