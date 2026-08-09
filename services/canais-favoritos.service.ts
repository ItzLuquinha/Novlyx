const CHAVE = "novlyx-canais-favoritos";
export const EVENTO_CANAIS_FAV = "novlyx-canais-favoritos";

function ler(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function gravar(ids: string[]) {
  localStorage.setItem(CHAVE, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENTO_CANAIS_FAV));
}

export function getCanaisFavoritosIds(): string[] {
  return ler();
}

export function isCanalFavorito(id: string): boolean {
  return ler().includes(id);
}

export function alternarCanalFavorito(id: string): boolean {
  const atual = ler();
  const idx = atual.indexOf(id);
  if (idx >= 0) {
    atual.splice(idx, 1);
    gravar(atual);
    return false;
  }
  gravar([id, ...atual]);
  return true;
}
