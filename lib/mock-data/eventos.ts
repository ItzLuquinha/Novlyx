import { CategoriaEvento, EventoEsportivo, StatusEvento } from "@/types";
import { gerarBannerPlaceholder, gerarPosterPlaceholder } from "@/utils/placeholder";

export const CATEGORIAS_EVENTOS: CategoriaEvento[] = [
  { id: "futebol", nome: "Futebol" },
  { id: "basquete", nome: "Basquete" },
  { id: "mma", nome: "MMA" },
  { id: "tenis", nome: "Tenis" },
  { id: "automobilismo", nome: "Automobilismo" },
  { id: "volei", nome: "Volei" },
];

const TIMES_FUTEBOL = [
  "Estrela Vermelha FC", "Uniao Atletico", "Portuaria SC", "Vale Dourado FC",
  "Meridiano EC", "Litoral Sport", "Real Cordilheira", "Atletico Central",
];

const TIMES_BASQUETE = [
  "Falcoes BC", "Tigres do Norte", "Panteras Basket", "Aguias Douradas",
];

const CAMPEONATOS: Record<string, string[]> = {
  futebol: ["Campeonato Nacional", "Copa Continental", "Liga Regional"],
  basquete: ["Liga Nacional de Basquete", "Copa das Americas"],
  mma: ["Circuito de Combate", "Grande Torneio de MMA"],
  tenis: ["Grand Slam Continental", "Circuito Aberto"],
  automobilismo: ["Grande Premio Nacional", "Copa de Velocidade"],
  volei: ["Superliga Nacional", "Copa de Volei"],
};

function gerarEventosFutebol(quantidade: number): EventoEsportivo[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const casa = TIMES_FUTEBOL[i % TIMES_FUTEBOL.length]!;
    const visitante = TIMES_FUTEBOL[(i + 3) % TIMES_FUTEBOL.length]!;
    const status: StatusEvento =
      i % 5 === 0 ? "ao_vivo" : i % 5 === 1 ? "encerrado" : "agendado";
    const titulo = `${casa} x ${visitante}`;

    return {
      id: `evento-futebol-${i + 1}`,
      titulo,
      campeonato: CAMPEONATOS.futebol![i % CAMPEONATOS.futebol!.length]!,
      categoriaId: "futebol",
      categoriaNome: "Futebol",
      timeCasa: casa,
      timeCasaEscudoUrl: gerarPosterPlaceholder(casa, { largura: 200, altura: 200 }),
      timeVisitante: visitante,
      timeVisitanteEscudoUrl: gerarPosterPlaceholder(visitante, {
        largura: 200,
        altura: 200,
      }),
      imagemUrl: gerarBannerPlaceholder(titulo),
      dataHora: new Date(
        Date.now() + (i - quantidade / 2) * 1000 * 60 * 60 * 8
      ).toISOString(),
      status,
      canal: "Vertex Esportes",
      placarCasa: status !== "agendado" ? i % 4 : undefined,
      placarVisitante: status !== "agendado" ? (i + 1) % 3 : undefined,
    };
  });
}

function gerarEventosOutros(
  categoriaId: string,
  categoriaNome: string,
  times: string[],
  quantidade: number
): EventoEsportivo[] {
  return Array.from({ length: quantidade }, (_, i) => {
    const casa = times[i % times.length]!;
    const visitante = times[(i + 1) % times.length]!;
    const status: StatusEvento =
      i % 6 === 0 ? "ao_vivo" : i % 6 === 1 ? "encerrado" : "agendado";
    const titulo =
      categoriaId === "mma" || categoriaId === "tenis"
        ? `${casa} vs ${visitante}`
        : `${casa} x ${visitante}`;

    return {
      id: `evento-${categoriaId}-${i + 1}`,
      titulo,
      campeonato:
        CAMPEONATOS[categoriaId]![i % CAMPEONATOS[categoriaId]!.length]!,
      categoriaId,
      categoriaNome,
      timeCasa: casa,
      timeCasaEscudoUrl: gerarPosterPlaceholder(casa, { largura: 200, altura: 200 }),
      timeVisitante: visitante,
      timeVisitanteEscudoUrl: gerarPosterPlaceholder(visitante, {
        largura: 200,
        altura: 200,
      }),
      imagemUrl: gerarBannerPlaceholder(titulo),
      dataHora: new Date(
        Date.now() + (i - quantidade / 2) * 1000 * 60 * 60 * 10
      ).toISOString(),
      status,
      canal: "Arena Total",
      placarCasa: status !== "agendado" ? i % 3 : undefined,
      placarVisitante: status !== "agendado" ? (i + 2) % 4 : undefined,
    };
  });
}

export const EVENTOS_ESPORTIVOS: EventoEsportivo[] = [
  ...gerarEventosFutebol(24),
  ...gerarEventosOutros("basquete", "Basquete", TIMES_BASQUETE, 10),
  ...gerarEventosOutros(
    "mma",
    "MMA",
    ["Lutador Vulcano", "Lutador Titanio", "Lutador Fenix", "Lutador Aco"],
    8
  ),
  ...gerarEventosOutros(
    "tenis",
    "Tenis",
    ["A. Ferrari", "M. Duval", "R. Kimura", "L. Andersen"],
    8
  ),
  ...gerarEventosOutros(
    "automobilismo",
    "Automobilismo",
    ["Equipe Relampago", "Equipe Vortex", "Equipe Aurora", "Equipe Meridiano"],
    6
  ),
  ...gerarEventosOutros(
    "volei",
    "Volei",
    ["Selecao Norte", "Selecao Sul", "Selecao Leste", "Selecao Oeste"],
    8
  ),
];
