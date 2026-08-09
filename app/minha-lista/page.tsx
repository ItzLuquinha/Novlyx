import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MinhaListaClient } from "@/components/features/minha-lista-client";

export default function PaginaMinhaLista() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <MinhaListaClient />
      </main>
      <Footer />
    </>
  );
}
