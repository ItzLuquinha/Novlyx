import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SorteioClient } from "@/components/features/sorteio-client";

export const metadata: Metadata = {
  title: "Me surpreenda | NOVLYX",
  description: "Sorteie 3 filmes por genero, epoca, tempo e nota.",
};

export default function PaginaSorteio() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16 lg:pt-24">
        <SorteioClient />
      </main>
      <Footer />
    </>
  );
}
