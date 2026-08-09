export function formatarDuracao(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;
  if (horas === 0) return `${min}min`;
  if (min === 0) return `${horas}h`;
  return `${horas}h ${min}min`;
}

export function formatarTempoPlayer(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const min = Math.floor((segundos % 3600) / 60);
  const seg = Math.floor(segundos % 60);

  if (horas > 0) {
    return `${horas}:${String(min).padStart(2, "0")}:${String(seg).padStart(2, "0")}`;
  }
  return `${min}:${String(seg).padStart(2, "0")}`;
}

export function formatarNota(nota: number): string {
  return nota.toFixed(1);
}

export function formatarDataRelativa(dataIso: string): string {
  const data = new Date(dataIso);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return "Hoje";
  if (diffDias === 1) return "Ontem";
  if (diffDias < 7) return `Ha ${diffDias} dias`;
  if (diffDias < 30) return `Ha ${Math.floor(diffDias / 7)} semanas`;
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatarDataCurta(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatarHora(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calcularPercentualProgresso(
  atual: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((atual / total) * 100));
}
