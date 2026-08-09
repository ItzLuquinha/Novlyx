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

/** Filmes: itens de listagem de filme (já vêm de /trending de movies). */
export function filtrarFilmes(itens: EmbedItem[]): EmbedItem[] {
  return itens.filter((item) => Boolean(item.title || item.original_title));
}

/**
 * Séries: TV sem foco em anime.
 * Remove itens claramente de animação japonesa / genre Animation dominante.
 */
export function filtrarSeries(itens: EmbedItem[]): EmbedItem[] {
  return itens.filter((item) => {
    if (!item.name && !item.original_name && !item.title) return false;
    // Animes JP com Animation → página de animes
    if (temAnimacao(item) && (idioma(item) === "ja" || idioma(item) === "japanese")) {
      return false;
    }
    if (temAnimacao(item) && idioma(item) === "ja") return false;
    // Só Animation + sem drama live-action típico
    const g = generos(item);
    if (g.includes("animation") && !g.some((x) => x.includes("drama") || x.includes("comedy") || x.includes("action"))) {
      // Futurama etc. ainda pode aparecer; se só Animation, manda pro anime se JP
      if (idioma(item).startsWith("ja")) return false;
    }
    return true;
  });
}

/** Animes: Animation e/ou japonês com cara de anime. */
export function filtrarAnimes(itens: EmbedItem[]): EmbedItem[] {
  return itens.filter((item) => {
    const lang = idioma(item);
    const g = generos(item);
    if (temAnimacao(item)) return true;
    if (lang === "ja" || lang === "japanese") {
      // JP sem Reality/Talk
      if (g.some((x) => x.includes("reality") || x.includes("talk") || x.includes("news"))) {
        return false;
      }
      return true;
    }
    // título contém anime
    const nome = `${item.name || ""} ${item.title || ""}`.toLowerCase();
    if (nome.includes("anime") || nome.includes("naruto") || nome.includes("bleach")) {
      return true;
    }
    return false;
  });
}

/**
 * Doramas: coreano, chinês, taiwanês, tailandês + drama;
 * ou japonês live-action (sem Animation).
 */
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
      // às vezes original_language vem "Korean"
      if (!["korean", "chinese", "japanese", "thai"].includes(lang)) {
        return false;
      }
    }
    // Animes JP fora
    if (temAnimacao(item)) return false;
    return true;
  });
}
