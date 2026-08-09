import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PaginaCategoriaClient } from "@/components/features/pagina-categoria-client";

export default function PaginaSeries() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <PaginaCategoriaClient categoria="serie" titulo="Series" />
      </main>
      <Footer />
    </>
  );
}
