import { ItemMinhaLista } from "@/types";

const CHAVE_STORAGE = "novlyx:minha-lista";

function lerStorage(): ItemMinhaLista[] {
  if (typeof window === "undefined") return [];
  try {
    const dados = window.localStorage.getItem(CHAVE_STORAGE);
    return dados ? (JSON.parse(dados) as ItemMinhaLista[]) : [];
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
    (a, b) => new Date(b.adicionadoEm).getTime() - new Date(a.adicionadoEm).getTime()
  );
}

export function estaNaMinhaLista(conteudoId: string): boolean {
  return lerStorage().some((item) => item.conteudoId === conteudoId);
}

export function adicionarNaMinhaLista(item: Omit<ItemMinhaLista, "adicionadoEm">) {
  const itens = lerStorage();
  if (itens.some((i) => i.conteudoId === item.conteudoId)) return;

  const novoItem: ItemMinhaLista = {
    ...item,
    adicionadoEm: new Date().toISOString(),
  };

  escreverStorage([...itens, novoItem]);
}

export function removerDaMinhaLista(conteudoId: string) {
  const itens = lerStorage().filter((item) => item.conteudoId !== conteudoId);
  escreverStorage(itens);
}

export function alternarMinhaLista(item: Omit<ItemMinhaLista, "adicionadoEm">) {
  if (estaNaMinhaLista(item.conteudoId)) {
    removerDaMinhaLista(item.conteudoId);
    return false;
  }
  adicionarNaMinhaLista(item);
  return true;
}
