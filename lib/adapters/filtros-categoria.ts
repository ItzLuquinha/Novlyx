import { EmbedItem } from "@/lib/adapters/2embed";

function generos(item: EmbedItem): string[] {
  return (item.genres ?? []).map((g) => g.toLowerCase());
}

function idioma(item: EmbedItem): string {
  return (item.original_language || "").toLowerCase();
}

function temAnimacao(item: EmbedItem): boolean {
  return generos(item).some(
    (g) =>
      g.includes("animation") ||
      g.includes("anime") ||
      g === "animação"
  );
}

export function filtrarFilmes(itens: EmbedItem[]): EmbedItem[] {
  return itens.filter((item) => Boolean(item.title || item.original_title));
}

export function filtrarSeries(itens: EmbedItem[]): EmbedItem[] {
  return itens.filter((item) => {
    if (!item.name && !item.original_name && !item.title) return false;
    
    if (temAnimacao(item) && (idioma(item) === "ja" || idioma(item) === "japanese")) {
      return false;
    }
    if (temAnimacao(item) && idioma(item) === "ja") return false;
    
    const g = generos(item);
    if (g.includes("animation") && !g.some((x) => x.includes("drama") || x.includes("comedy") || x.includes("action"))) {
      
      if (idioma(item).startsWith("ja")) return false;
    }
    return true;
  });
}

export function filtrarAnimes(itens: EmbedItem[]): EmbedItem[] {
  return itens.filter((item) => {
    const lang = idioma(item);
    const g = generos(item);
    if (temAnimacao(item)) return true;
    if (lang === "ja" || lang === "japanese") {
      
      if (g.some((x) => x.includes("reality") || x.includes("talk") || x.includes("news"))) {
        return false;
      }
      return true;
    }
    
    const nome = `${item.name || ""} ${item.title || ""}`.toLowerCase();
    if (nome.includes("anime") || nome.includes("naruto") || nome.includes("bleach")) {
      return true;
    }
    return false;
  });
}

export function filtrarDoramas(itens: EmbedItem[]): EmbedItem[] {
  const langsOk = new Set([
    "ko",
    "korean",
    "zh",
    "cn",
    "zh-cn",
    "zh-tw",
    "chinese",
    "th",
    "thai",
    "ja",
    "japanese",
  ]);

  return itens.filter((item) => {
    const lang = idioma(item);
    if (!langsOk.has(lang)) {
      
      if (!["korean", "chinese", "japanese", "thai"].includes(lang)) {
        return false;
      }
    }
    
    if (temAnimacao(item)) return false;
    return true;
  });
}
