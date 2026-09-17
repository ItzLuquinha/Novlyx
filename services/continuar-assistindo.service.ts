import { ProgressoContinuarAssistindo } from "@/types";
import { chaveProgresso } from "@/lib/identidade";

const CHAVE_STORAGE = "novlyx-continuar-assistindo";
export const EVENTO_PROGRESSO = "novlyx-progresso-atualizado";

function migrarItem(raw: Record<string, unknown>): ProgressoContinuarAssistindo {
  const categoria = (raw.categoria as ProgressoContinuarAssistindo["categoria"]) || "filme";
  const conteudoId = String(raw.conteudoId || raw.idInterno || "");
  const idInterno = String(raw.idInterno || raw.conteudoId || "");
  const season = raw.temporadaNumero as number | undefined;
  const episode = raw.episodioNumero as number | undefined;
  const progressKey =
    (raw.progressKey as string) ||
    chaveProgresso(categoria, idInterno, season, episode);
  return {
    progressKey,
    conteudoId,
    idInterno,
    categoria,
    tmdbId: raw.tmdbId as string | undefined,
    imdbId: raw.imdbId as string | undefined,
    titulo: String(raw.titulo || ""),
    posterUrl: String(raw.posterUrl || ""),
    temporadaId: raw.temporadaId as string | undefined,
    temporadaNumero: season,
    episodioId: raw.episodioId as string | undefined,
    episodioNumero: episode,
    tempoAtualSegundos: Number(raw.tempoAtualSegundos || 0),
    duracaoTotalSegundos: Number(raw.duracaoTotalSegundos || 0),
    atualizadoEm: String(raw.atualizadoEm || new Date().toISOString()),
  };
}

function lerStorage(): ProgressoContinuarAssistindo[] {
  if (typeof window === "undefined") return [];
  try {
    const dados = window.localStorage.getItem(CHAVE_STORAGE);
    if (!dados) return [];
    const parsed = JSON.parse(dados);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => migrarItem(item as Record<string, unknown>));
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
  const todos = lerStorage().sort(
    (a, b) =>
      new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
  );
  const visto = new Set<string>();
  const porTitulo: ProgressoContinuarAssistindo[] = [];
  for (const item of todos) {
    const chave = item.idInterno || item.conteudoId;
    if (visto.has(chave)) continue;
    visto.add(chave);
    porTitulo.push(item);
  }
  return porTitulo;
}

export function getProgressoConteudo(
  conteudoId: string,
  season?: number,
  episode?: number
): ProgressoContinuarAssistindo | null {
  const itens = lerStorage();
  if (season && episode) {
    return (
      itens.find(
        (item) =>
          (item.idInterno === conteudoId || item.conteudoId === conteudoId) &&
          item.temporadaNumero === season &&
          item.episodioNumero === episode
      ) ?? null
    );
  }
  return (
    itens
      .filter(
        (item) =>
          item.idInterno === conteudoId || item.conteudoId === conteudoId
      )
      .sort(
        (a, b) =>
          new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
      )[0] ?? null
  );
}

export function salvarProgresso(
  progresso: Omit<
    ProgressoContinuarAssistindo,
    "atualizadoEm" | "progressKey" | "idInterno"
  > & {
    progressKey?: string;
    idInterno?: string;
  }
) {
  if (progresso.tempoAtualSegundos < 15 && !progresso.episodioNumero) {
    if (!progresso.temporadaNumero) return;
  }
  if (progresso.tempoAtualSegundos < 5) return;

  const idInterno = progresso.idInterno || progresso.conteudoId;
  const key =
    progresso.progressKey ||
    chaveProgresso(
      progresso.categoria,
      idInterno,
      progresso.temporadaNumero,
      progresso.episodioNumero
    );

  const itens = lerStorage().filter((item) => item.progressKey !== key);

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
    progressKey: key,
    idInterno,
    conteudoId: progresso.conteudoId || idInterno,
    duracaoTotalSegundos: duracao,
    tempoAtualSegundos: Math.floor(progresso.tempoAtualSegundos),
    atualizadoEm: new Date().toISOString(),
  };

  escreverStorage([novoProgresso, ...itens].slice(0, 80));
}

export function removerProgresso(conteudoId: string) {
  const itens = lerStorage().filter(
    (item) => item.conteudoId !== conteudoId && item.idInterno !== conteudoId
  );
  escreverStorage(itens);
}

export function limparContinuarAssistindo() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHAVE_STORAGE);
  window.dispatchEvent(new CustomEvent(EVENTO_PROGRESSO));
}
