import { Suspense } from "react";
import { PlayerLoader } from "@/components/features/player/player-loader";

interface Props {
  params: Promise<{ categoria: string; id: string }>;
}

export default async function PaginaPlayerCategoria({ params }: Props) {
  const { categoria, id } = await params;

  return (
    <main className="min-h-screen bg-black">
      <Suspense fallback={<div className="aspect-video w-full bg-black" />}>
        <PlayerLoader categoria={categoria} id={id} />
      </Suspense>
    </main>
  );
}
