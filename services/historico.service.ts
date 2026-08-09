import { CategoriaConteudo } from "@/types";

export interface ItemHistorico {
  conteudoId: string;
  categoria: CategoriaConteudo;
  titulo: string;
  posterUrl: string;
  temporadaNumero?: number;
  episodioNumero?: number;
  tempoAtualSegundos: number;
  assistidoEm: string;
}

const CHAVE = "novlyx-historico";
export const EVENTO_HISTORICO = "novlyx-historico";

function ler(): ItemHistorico[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? (JSON.parse(raw) as ItemHistorico[]) : [];
  } catch {
    return [];
  }
}

function gravar(itens: ItemHistorico[]) {
  localStorage.setItem(CHAVE, JSON.stringify(itens.slice(0, 100)));
  window.dispatchEvent(new CustomEvent(EVENTO_HISTORICO));
}

export function getHistorico(): ItemHistorico[] {
  return ler().sort(
    (a, b) =>
      new Date(b.assistidoEm).getTime() - new Date(a.assistidoEm).getTime()
  );
}

export function registrarHistorico(
  item: Omit<ItemHistorico, "assistidoEm">
) {
  if (typeof window === "undefined") return;
  if (item.tempoAtualSegundos < 10) return;
  const outros = ler().filter((i) => i.conteudoId !== item.conteudoId);
  gravar([
    { ...item, assistidoEm: new Date().toISOString() },
    ...outros,
  ]);
}

export function limparHistorico() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAVE);
  window.dispatchEvent(new CustomEvent(EVENTO_HISTORICO));
}
