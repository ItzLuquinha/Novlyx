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
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ItemHistorico[]) : [];
  } catch {
    return [];
  }
}

function gravar(itens: ItemHistorico[]) {
  if (typeof window === "undefined") return;
  try {
    if (itens.length === 0) {
      localStorage.removeItem(CHAVE);
    } else {
      localStorage.setItem(CHAVE, JSON.stringify(itens.slice(0, 100)));
    }
  } catch {
    
  }
  window.dispatchEvent(new CustomEvent(EVENTO_HISTORICO));
}

export function getHistorico(): ItemHistorico[] {
  return ler().sort(
    (a, b) =>
      new Date(b.assistidoEm).getTime() - new Date(a.assistidoEm).getTime()
  );
}

export function registrarHistorico(
  item: Omit<ItemHistorico, "assistidoEm">,
  opcoes?: { forcar?: boolean }
) {
  if (typeof window === "undefined") return;
  if (item.tempoAtualSegundos < 10) return;

  const atual = ler();
  const existente = atual.find((i) => i.conteudoId === item.conteudoId);

  if (existente && !opcoes?.forcar) {
    const idadeMs =
      Date.now() - new Date(existente.assistidoEm).getTime();
    const tempoSubiu =
      item.tempoAtualSegundos - (existente.tempoAtualSegundos || 0);
    
    if (idadeMs < 20_000 && tempoSubiu < 15) {
      return;
    }
  }

  const outros = atual.filter((i) => i.conteudoId !== item.conteudoId);
  gravar([
    { ...item, assistidoEm: new Date().toISOString() },
    ...outros,
  ]);
}

export function limparHistorico() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAVE);
    
    localStorage.setItem(CHAVE, "[]");
    localStorage.removeItem(CHAVE);
  } catch {
    
  }
  window.dispatchEvent(new CustomEvent(EVENTO_HISTORICO));
}
