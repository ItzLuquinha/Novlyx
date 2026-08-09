import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PaginaCategoriaClient } from "@/components/features/pagina-categoria-client";

export default function PaginaFilmes() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <PaginaCategoriaClient categoria="filme" titulo="Filmes" />
      </main>
      <Footer />
    </>
  );
}
