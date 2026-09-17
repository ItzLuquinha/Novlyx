import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConteudoDetalheLoader } from "@/components/features/conteudo-detalhe-loader";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function PaginaConteudo({ params }: Props) {
  const { slug } = await params;
  const partes = (slug || []).filter(Boolean);

  let categoria = "filme";
  let id = "";

  if (partes.length >= 2) {
    categoria = partes[0] || "filme";
    id = partes[1] || "";
  } else if (partes.length === 1) {
    id = partes[0] || "";
    // tenta detectar categoria pelo prefixo do idInterno
    const m = id.match(/^(filme|serie|anime|dorama):/i);
    if (m) categoria = m[1]!.toLowerCase();
    else categoria = "serie"; // fallback seguro para TV/anime ids numericos ambíguos
  }

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
