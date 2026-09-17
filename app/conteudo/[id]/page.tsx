import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConteudoDetalheLoaderLegado } from "@/components/features/conteudo-detalhe-loader-legado";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaginaConteudo({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main>
        <ConteudoDetalheLoaderLegado id={id} />
      </main>
      <Footer />
    </>
  );
}
