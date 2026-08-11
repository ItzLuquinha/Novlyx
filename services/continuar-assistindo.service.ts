import { ProgressoContinuarAssistindo } from "@/types";

const CHAVE_STORAGE = "novlyx-continuar-assistindo";
export const EVENTO_PROGRESSO = "novlyx-progresso-atualizado";

function lerStorage(): ProgressoContinuarAssistindo[] {
  if (typeof window === "undefined") return [];
  try {
    const dados = window.localStorage.getItem(CHAVE_STORAGE);
    return dados ? (JSON.parse(dados) as ProgressoContinuarAssistindo[]) : [];
  } catch {
    return [];
  }
}

function escreverStorage(itens: ProgressoContinuarAssistindo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
  window.dispatchEvent(new CustomEvent(EVENTO_PROGRESSO));
}

export function getContinuarAssistindo(): ProgressoContinuarAssistindo[] {
  return lerStorage().sort(
    (a, b) =>
      new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
  );
}

export function getProgressoConteudo(
  conteudoId: string
): ProgressoContinuarAssistindo | null {
  return lerStorage().find((item) => item.conteudoId === conteudoId) ?? null;
}

export function salvarProgresso(
  progresso: Omit<ProgressoContinuarAssistindo, "atualizadoEm">
) {
  
  if (progresso.tempoAtualSegundos < 15 && !progresso.episodioNumero) {
    
    if (!progresso.temporadaNumero) return;
  }
  if (progresso.tempoAtualSegundos < 5) return;

  const itens = lerStorage().filter(
    (item) => item.conteudoId !== progresso.conteudoId
  );

  
  const duracao = Math.max(
    progresso.duracaoTotalSegundos || 0,
    progresso.tempoAtualSegundos + 60,
    30 * 60
  );

  const percentualConcluido =
    duracao > 0 ? progresso.tempoAtualSegundos / duracao : 0;

  
  if (percentualConcluido >= 0.95) {
    escreverStorage(itens);
    return;
  }

  const novoProgresso: ProgressoContinuarAssistindo = {
    ...progresso,
    duracaoTotalSegundos: duracao,
    tempoAtualSegundos: Math.floor(progresso.tempoAtualSegundos),
    atualizadoEm: new Date().toISOString(),
  };

  escreverStorage([novoProgresso, ...itens].slice(0, 40));
}

export function removerProgresso(conteudoId: string) {
  const itens = lerStorage().filter((item) => item.conteudoId !== conteudoId);
  escreverStorage(itens);
}

export function limparContinuarAssistindo() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAVE_STORAGE);
  window.dispatchEvent(new CustomEvent(EVENTO_PROGRESSO));
}
