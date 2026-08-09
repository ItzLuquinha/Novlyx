import { Canal, CategoriaCanal } from "@/types";
import { CANAIS, CATEGORIAS_CANAIS } from "@/lib/mock-data/canais";

interface IptvResponse {
  canais: Canal[];
  categorias: CategoriaCanal[];
  total?: number;
}

async function carregarIptv(): Promise<IptvResponse | null> {
  try {
    const url =
      typeof window !== "undefined"
        ? "/api/iptv/br"
        : `${process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000"}/api/iptv/br`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as IptvResponse;
  } catch {
    return null;
  }
}

export async function getCanais(filtros?: {
  q?: string;
  genre?: string;
  limit?: number;
}): Promise<Canal[]> {
  const data = await carregarIptv();
  let lista = data?.canais?.length ? data.canais : CANAIS;

  if (filtros?.genre) {
    lista = lista.filter((c) => c.categoriaId === filtros.genre);
  }
  if (filtros?.q) {
    const q = filtros.q.toLowerCase();
    lista = lista.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.categoriaNome.toLowerCase().includes(q)
    );
  }
  if (filtros?.limit) lista = lista.slice(0, filtros.limit);
  return lista;
}

export async function getCategoriasCanais(): Promise<CategoriaCanal[]> {
  const data = await carregarIptv();
  if (data?.categorias?.length) return data.categorias;
  return CATEGORIAS_CANAIS;
}

export async function getCanalPorId(id: string): Promise<Canal | null> {
  const canais = await getCanais();
  return canais.find((c) => c.id === id) ?? null;
}
