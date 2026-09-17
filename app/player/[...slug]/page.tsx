import { Suspense } from "react";
import { PlayerLoader } from "@/components/features/player/player-loader";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function PaginaPlayer({ params }: Props) {
  const { slug } = await params;
  const partes = (slug || []).filter(Boolean);

  let categoria = "filme";
  let id = "";

  if (partes.length >= 2) {
    categoria = partes[0] || "filme";
    id = partes[1] || "";
  } else if (partes.length === 1) {
    id = partes[0] || "";
    const m = id.match(/^(filme|serie|anime|dorama):/i);
    if (m) categoria = m[1]!.toLowerCase();
    else categoria = "serie";
  }

  return (
    <main className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-black text-sm text-white/40">
            Carregando player...
          </div>
        }
      >
        <PlayerLoader categoria={categoria} id={id} />
      </Suspense>
    </main>
  );
}
