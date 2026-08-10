/**
 * Placar e jogos via ESPN site API (pública, sem chave).
 * Usado só para placar/agenda — não transmite o jogo.
 */

export interface JogoEsportivo {
  id: string;
  competicao: string;
  status: "agendado" | "ao_vivo" | "encerrado";
  statusTexto: string;
  dataHora: string;
  casa: string;
  fora: string;
  placarCasa?: number;
  placarFora?: number;
  logoCasa?: string;
  logoFora?: string;
}

const LIGAS = [
  { path: "soccer/bra.1", nome: "Brasileirão Série A" },
  { path: "soccer/eng.1", nome: "Premier League" },
  { path: "soccer/esp.1", nome: "La Liga" },
  { path: "soccer/uefa.champions", nome: "Champions League" },
  { path: "basketball/nba", nome: "NBA" },
];

function mapStatus(state: string | undefined): JogoEsportivo["status"] {
  const s = (state || "").toLowerCase();
  if (s === "in" || s.includes("progress") || s === "live") return "ao_vivo";
  if (s === "post" || s === "final") return "encerrado";
  return "agendado";
}

export async function getJogosEsportivos(): Promise<JogoEsportivo[]> {
  const resultados: JogoEsportivo[] = [];

  await Promise.all(
    LIGAS.map(async (liga) => {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/${liga.path}/scoreboard`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          events?: Array<{
            id: string;
            date: string;
            status?: {
              type?: { state?: string; description?: string; shortDetail?: string };
            };
            competitions?: Array<{
              competitors?: Array<{
                homeAway?: string;
                score?: string;
                team?: { displayName?: string; logo?: string };
              }>;
            }>;
          }>;
        };

        for (const ev of data.events ?? []) {
          const comp = ev.competitions?.[0];
          const casa = comp?.competitors?.find((c) => c.homeAway === "home");
          const fora = comp?.competitors?.find((c) => c.homeAway === "away");
          const state = ev.status?.type?.state;
          const status = mapStatus(state);
          resultados.push({
            id: `${liga.path}-${ev.id}`,
            competicao: liga.nome,
            status,
            statusTexto:
              ev.status?.type?.shortDetail ||
              ev.status?.type?.description ||
              status,
            dataHora: ev.date,
            casa: casa?.team?.displayName || "Casa",
            fora: fora?.team?.displayName || "Fora",
            placarCasa:
              casa?.score != null && casa.score !== ""
                ? Number(casa.score)
                : undefined,
            placarFora:
              fora?.score != null && fora.score !== ""
                ? Number(fora.score)
                : undefined,
            logoCasa: casa?.team?.logo,
            logoFora: fora?.team?.logo,
          });
        }
      } catch {
        /* liga offline */
      }
    })
  );

  // ao vivo primeiro, depois agendados
  const peso = { ao_vivo: 0, agendado: 1, encerrado: 2 };
  return resultados.sort(
    (a, b) =>
      peso[a.status] - peso[b.status] ||
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
  );
}
