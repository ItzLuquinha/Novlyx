import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instalar app | NOVLYX",
  description: "Como adicionar a NOVLYX na tela inicial do iPhone, iPad e Android.",
};

export default function PaginaInstalar() {
  return (
    <>
      <Header />
      <main className="container max-w-2xl pb-20 pt-24">
        <p className="text-xs uppercase tracking-[0.16em] text-novlyx-accent">
          App
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Transformar a NOVLYX em app
        </h1>
        <p className="mt-3 text-sm text-white/50">
          Voce pode fixar o site na tela inicial e abrir como um aplicativo,
          sem instalar nada da App Store.
        </p>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-medium text-white">iPhone / iPad (Safari)</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/60">
            <li>Abra a NOVLYX no <strong className="text-white/80">Safari</strong> (nao no Chrome).</li>
            <li>Toque no botao de <strong className="text-white/80">Compartilhar</strong> (quadrado com seta para cima).</li>
            <li>Role as opcoes e toque em <strong className="text-white/80">Adicionar a Tela de Inicio</strong>.</li>
            <li>Confirme o nome (NOVLYX) e toque em <strong className="text-white/80">Adicionar</strong>.</li>
            <li>O icone aparece na Home Screen - abra por ele da proxima vez.</li>
          </ol>
          <p className="text-xs text-white/35">
            No iOS, “Adicionar a Tela de Inicio” so aparece de forma confiavel no Safari.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-medium text-white">Android (Chrome)</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/60">
            <li>Abra a NOVLYX no Chrome.</li>
            <li>Toque no menu (tres pontinhos).</li>
            <li>
              Escolha <strong className="text-white/80">Instalar app</strong> ou{" "}
              <strong className="text-white/80">Adicionar a tela inicial</strong>.
            </li>
            <li>Confirme. O atalho fica na area de apps / home.</li>
          </ol>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-medium text-white">Computador</h2>
          <p className="text-sm text-white/60">
            No Chrome ou Edge: menu → <strong className="text-white/80">Instalar NOVLYX</strong>{" "}
            (ou icone de instalacao na barra de endereco), se disponivel.
          </p>
        </section>

        <p className="mt-12 text-sm text-white/40">
          <Link href="/" className="text-novlyx-accent hover:underline">
            Voltar ao inicio
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
