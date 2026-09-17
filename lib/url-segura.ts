import { ehCategoriaValida } from "@/lib/identidade";

export function urlHttpSegura(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const limpa = url.trim();
  if (!limpa || limpa.length > 2000) return null;
  try {
    const u = new URL(limpa);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (u.username || u.password) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function idConteudoSeguro(id: string | null | undefined): string | null {
  if (!id) return null;
  const limpo = decodeURIComponent(id).trim();
  if (/^tt\d{5,12}$/i.test(limpo)) return limpo;
  if (/^\d{1,12}$/.test(limpo)) return limpo;
  if (
    /^(filme|serie|anime|dorama):(tmdb|imdb|interno):[a-zA-Z0-9._-]{1,80}$/.test(
      limpo
    )
  ) {
    return limpo;
  }
  if (/^[a-zA-Z0-9._-]{1,80}$/.test(limpo)) return limpo;
  return null;
}

export function categoriaRotaSegura(
  valor: string | null | undefined
): "filme" | "serie" | "anime" | "dorama" | null {
  if (!valor) return null;
  return ehCategoriaValida(valor) ? valor : null;
}
