import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeClient } from "@/components/features/home-client";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeClient />
      </main>
      <Footer />
    </>
  );
}
