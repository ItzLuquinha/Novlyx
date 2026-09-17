import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getConteudoPorCategoria } from "@/services";
import { categoriaRotaSegura, idConteudoSeguro } from "@/lib/url-segura";
import { PlayerPageClient } from "@/components/features/player/player-page-client";

interface Props {
  params: Promise<{ categoria: string; id: string }>;
}

export default async function PaginaPlayerCategoria({ params }: Props) {
  const { categoria: catRaw, id } = await params;
  const categoria = categoriaRotaSegura(catRaw);
  const idLimpo = idConteudoSeguro(id);
  if (!categoria || !idLimpo) notFound();

  let conteudo = null;
  try {
    conteudo = await getConteudoPorCategoria(categoria, idLimpo);
  } catch (erro) {
    console.error("[PaginaPlayer]", categoria, idLimpo, erro);
  }
  if (!conteudo) notFound();

  return (
    <main className="min-h-screen bg-black">
      <Suspense fallback={<div className="aspect-video w-full bg-black" />}>
        <PlayerPageClient conteudo={conteudo} />
      </Suspense>
    </main>
  );
}
