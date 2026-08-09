import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BuscaClient } from "@/components/features/busca-client";

export default function PaginaBusca() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <Suspense fallback={null}>
          <BuscaClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
