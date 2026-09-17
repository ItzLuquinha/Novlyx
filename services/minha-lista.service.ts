import { ItemMinhaLista } from "@/types";
import { chaveEstavel } from "@/lib/identidade";

const CHAVE_STORAGE = "novlyx:minha-lista";

function migrar(raw: Record<string, unknown>): ItemMinhaLista {
  const categoria = (raw.categoria as ItemMinhaLista["categoria"]) || "filme";
  const conteudoId = String(raw.conteudoId || raw.idInterno || "");
  const idInterno = String(raw.idInterno || raw.conteudoId || "");
  return {
    conteudoId: idInterno || conteudoId,
    idInterno,
    categoria,
    tmdbId: raw.tmdbId as string | undefined,
    imdbId: raw.imdbId as string | undefined,
    titulo: String(raw.titulo || ""),
    posterUrl: String(raw.posterUrl || ""),
    ano: Number(raw.ano || 0),
    nota: Number(raw.nota || 0),
    adicionadoEm: String(raw.adicionadoEm || new Date().toISOString()),
  };
}

function chaveItem(item: Pick<ItemMinhaLista, "categoria" | "tmdbId" | "imdbId" | "idInterno" | "conteudoId">) {
  return chaveEstavel({
    categoria: item.categoria,
    tmdbId: item.tmdbId,
    imdbId: item.imdbId,
    idInterno: item.idInterno || item.conteudoId,
  });
}

function lerStorage(): ItemMinhaLista[] {
  if (typeof window === "undefined") return [];
  try {
    const dados = window.localStorage.getItem(CHAVE_STORAGE);
    if (!dados) return [];
    const parsed = JSON.parse(dados);
    return Array.isArray(parsed)
      ? parsed.map((i) => migrar(i as Record<string, unknown>))
      : [];
  } catch {
    return [];
  }
}

function escreverStorage(itens: ItemMinhaLista[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
}

export function getMinhaLista(): ItemMinhaLista[] {
  return lerStorage().sort(
    (a, b) =>
      new Date(b.adicionadoEm).getTime() - new Date(a.adicionadoEm).getTime()
  );
}

export function estaNaMinhaLista(
  item: Pick<ItemMinhaLista, "categoria" | "tmdbId" | "imdbId" | "idInterno" | "conteudoId"> | string
): boolean {
  const lista = lerStorage();
  if (typeof item === "string") {
    return lista.some(
      (i) => i.conteudoId === item || i.idInterno === item || chaveItem(i) === item
    );
  }
  const chave = chaveItem(item);
  return lista.some((i) => chaveItem(i) === chave);
}

export function adicionarNaMinhaLista(item: Omit<ItemMinhaLista, "adicionadoEm">) {
  const itens = lerStorage();
  if (estaNaMinhaLista(item)) return;
  const novoItem: ItemMinhaLista = {
    ...item,
    idInterno: item.idInterno || item.conteudoId,
    conteudoId: item.idInterno || item.conteudoId,
    adicionadoEm: new Date().toISOString(),
  };
  escreverStorage([...itens, novoItem]);
}

export function removerDaMinhaLista(
  item: Pick<ItemMinhaLista, "categoria" | "tmdbId" | "imdbId" | "idInterno" | "conteudoId"> | string
) {
  const itens = lerStorage().filter((atual) => {
    if (typeof item === "string") {
      return (
        atual.conteudoId !== item &&
        atual.idInterno !== item &&
        chaveItem(atual) !== item
      );
    }
    return chaveItem(atual) !== chaveItem(item);
  });
  escreverStorage(itens);
}

export function alternarMinhaLista(item: Omit<ItemMinhaLista, "adicionadoEm">) {
  if (estaNaMinhaLista(item)) {
    removerDaMinhaLista(item);
    return false;
  }
  adicionarNaMinhaLista(item);
  return true;
}
