import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getConteudoPorId } from "@/services";
import { idConteudoSeguro } from "@/lib/url-segura";
import { PlayerPageClient } from "@/components/features/player/player-page-client";

interface PaginaPlayerProps {
  params: Promise<{ id: string }>;
}

export default async function PaginaPlayer({ params }: PaginaPlayerProps) {
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
    console.error("[PaginaPlayer] erro ao buscar", idOk, erro);
  }

  if (!conteudo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <Suspense fallback={<div className="aspect-video w-full bg-black" />}>
        <PlayerPageClient conteudo={conteudo!} />
      </Suspense>
    </main>
  );
}
