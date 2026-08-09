import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TvAoVivoClient } from "@/components/features/tv-ao-vivo-client";

export default function PaginaTvAoVivo() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <TvAoVivoClient />
      </main>
      <Footer />
    </>
  );
}
