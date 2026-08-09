import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HistoricoClient } from "@/components/features/historico-client";

export const metadata: Metadata = {
  title: "Histórico | NOVLYX",
  description: "Tudo que você já assistiu na NOVLYX.",
};

export default function PaginaHistorico() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <HistoricoClient />
      </main>
      <Footer />
    </>
  );
}
