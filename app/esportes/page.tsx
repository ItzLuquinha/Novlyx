import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EsportesClient } from "@/components/features/esportes-client";

export default function PaginaEsportes() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <EsportesClient />
      </main>
      <Footer />
    </>
  );
}
