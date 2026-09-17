import { CategoriaConteudo } from "@/types";
import { chaveProgresso } from "@/lib/identidade";

export interface ItemHistorico {
  historicoKey: string;
  conteudoId: string;
  idInterno: string;
  categoria: CategoriaConteudo;
  tmdbId?: string;
  imdbId?: string;
  titulo: string;
  posterUrl: string;
  temporadaNumero?: number;
  episodioNumero?: number;
  tempoAtualSegundos: number;
  assistidoEm: string;
}

const CHAVE = "novlyx-historico";
export const EVENTO_HISTORICO = "novlyx-historico";

function migrar(raw: Record<string, unknown>): ItemHistorico {
  const categoria = (raw.categoria as CategoriaConteudo) || "filme";
  const conteudoId = String(raw.conteudoId || raw.idInterno || "");
  const idInterno = String(raw.idInterno || raw.conteudoId || "");
  const season = raw.temporadaNumero as number | undefined;
  const episode = raw.episodioNumero as number | undefined;
  return {
    historicoKey:
      (raw.historicoKey as string) ||
      chaveProgresso(categoria, idInterno, season, episode),
    conteudoId,
    idInterno,
    categoria,
    tmdbId: raw.tmdbId as string | undefined,
    imdbId: raw.imdbId as string | undefined,
    titulo: String(raw.titulo || ""),
    posterUrl: String(raw.posterUrl || ""),
    temporadaNumero: season,
    episodioNumero: episode,
    tempoAtualSegundos: Number(raw.tempoAtualSegundos || 0),
    assistidoEm: String(raw.assistidoEm || new Date().toISOString()),
  };
}

function ler(): ItemHistorico[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAVE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((i) => migrar(i as Record<string, unknown>))
      : [];
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
    /* ignore */
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
  item: Omit<ItemHistorico, "assistidoEm" | "historicoKey" | "idInterno"> & {
    historicoKey?: string;
    idInterno?: string;
  },
  opcoes?: { forcar?: boolean }
) {
  if (typeof window === "undefined") return;
  if (item.tempoAtualSegundos < 10) return;

  const idInterno = item.idInterno || item.conteudoId;
  const key =
    item.historicoKey ||
    chaveProgresso(
      item.categoria,
      idInterno,
      item.temporadaNumero,
      item.episodioNumero
    );

  const atual = ler();
  const existente = atual.find((i) => i.historicoKey === key);

  if (existente && !opcoes?.forcar) {
    const idadeMs = Date.now() - new Date(existente.assistidoEm).getTime();
    const tempoSubiu =
      item.tempoAtualSegundos - (existente.tempoAtualSegundos || 0);
    if (idadeMs < 20_000 && tempoSubiu < 15) {
      return;
    }
  }

  const outros = atual.filter((i) => i.historicoKey !== key);
  gravar([
    {
      ...item,
      historicoKey: key,
      idInterno,
      conteudoId: item.conteudoId || idInterno,
      assistidoEm: new Date().toISOString(),
    },
    ...outros,
  ]);
}

export function limparHistorico() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENTO_HISTORICO));
}
