import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConfiguracoesClient } from "@/components/features/configuracoes-client";

export default function PaginaConfiguracoes() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 lg:pt-24">
        <ConfiguracoesClient />
      </main>
      <Footer />
    </>
  );
}
