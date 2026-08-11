import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConteudoDetalheClient } from "@/components/features/conteudo-detalhe-client";
import { getConteudoPorId } from "@/services";
import { idConteudoSeguro } from "@/lib/url-segura";

interface PaginaConteudoProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaConteudo({ params }: PaginaConteudoProps) {
  const { id } = await params;

  
  const idLimpo = idConteudoSeguro(id);
  if (!idLimpo) {
    notFound();
  }
  const idOk: string = idLimpo;

  let conteudo = null;
  try {
    conteudo = await getConteudoPorId(idOk);
  } catch (erro) {
    console.error("[PaginaConteudo] erro ao buscar", idOk, erro);
  }

  if (!conteudo) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <ConteudoDetalheClient conteudo={conteudo!} />
      </main>
      <Footer />
    </>
  );
}
