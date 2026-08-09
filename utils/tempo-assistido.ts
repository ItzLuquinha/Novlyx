/** mm:ss ou h:mm:ss no estilo YouTube */
export function formatarTimestamp(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function percentualProgresso(
  atual: number,
  total: number
): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (atual / total) * 100));
}

export function rotuloContinuar(opts: {
  tempoAtualSegundos: number;
  duracaoTotalSegundos: number;
  temporadaNumero?: number;
  episodioNumero?: number;
}): string {
  const ts = formatarTimestamp(opts.tempoAtualSegundos);
  const ep =
    opts.temporadaNumero && opts.episodioNumero
      ? `T${opts.temporadaNumero}:E${opts.episodioNumero} · `
      : "";
  return `${ep}Parou em ${ts}`;
}
