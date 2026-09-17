import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConteudoDetalheClient } from "@/components/features/conteudo-detalhe-client";
import { getConteudoPorCategoria } from "@/services";
import { categoriaRotaSegura, idConteudoSeguro } from "@/lib/url-segura";

interface Props {
  params: Promise<{ categoria: string; id: string }>;
}

export default async function PaginaConteudoCategoria({ params }: Props) {
  const { categoria: catRaw, id } = await params;
  const categoria = categoriaRotaSegura(catRaw);
  const idLimpo = idConteudoSeguro(id);
  if (!categoria || !idLimpo) notFound();

  let conteudo = null;
  try {
    conteudo = await getConteudoPorCategoria(categoria, idLimpo);
  } catch (erro) {
    console.error("[PaginaConteudo]", categoria, idLimpo, erro);
  }
  if (!conteudo) notFound();

  return (
    <>
      <Header />
      <main>
        <ConteudoDetalheClient conteudo={conteudo} />
      </main>
      <Footer />
    </>
  );
}
