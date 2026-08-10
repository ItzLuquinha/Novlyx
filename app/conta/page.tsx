import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContaClient } from "@/components/features/conta-client";

export default function PaginaConta() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 lg:pt-24">
        <ContaClient />
      </main>
      <Footer />
    </>
  );
}
