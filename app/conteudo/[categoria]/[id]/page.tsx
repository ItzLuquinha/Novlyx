import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConteudoDetalheLoader } from "@/components/features/conteudo-detalhe-loader";

interface Props {
  params: Promise<{ categoria: string; id: string }>;
}

export default async function PaginaConteudoCategoria({ params }: Props) {
  const { categoria, id } = await params;

  return (
    <>
      <Header />
      <main>
        <ConteudoDetalheLoader categoria={categoria} id={id} />
      </main>
      <Footer />
    </>
  );
}
