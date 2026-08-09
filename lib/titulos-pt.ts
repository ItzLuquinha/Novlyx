/**
 * Localiza títulos para PT-BR quando a API devolve nome em inglês.
 * Não é tradução completa - cobre franchises e padrões comuns no BR.
 */

const MAPA_EXATO: Record<string, string> = {
  "the shawshank redemption": "Um Sonho de Liberdade",
  "the godfather": "O Poderoso Chefão",
  "the dark knight": "Batman: O Cavaleiro das Trevas",
  "pulp fiction": "Pulp Fiction: Tempo de Violência",
  "forrest gump": "Forrest Gump: O Contador de Histórias",
  "inception": "A Origem",
  "interstellar": "Interestelar",
  "the matrix": "Matrix",
  "fight club": "Clube da Luta",
  "the silence of the lambs": "O Silêncio dos Inocentes",
  "gladiator": "Gladiador",
  "titanic": "Titanic",
  "avatar": "Avatar",
  "joker": "Coringa",
  "parasite": "Parasita",
  "oppenheimer": "Oppenheimer",
  "barbie": "Barbie",
  "dune": "Duna",
  "dune: part two": "Duna: Parte Dois",
  "dune part two": "Duna: Parte Dois",
  "the batman": "Batman",
  "top gun: maverick": "Top Gun: Maverick",
  "everything everywhere all at once": "Tudo em Todo Lugar ao Mesmo Tempo",
  "spider-man: no way home": "Homem-Aranha: Sem Volta para Casa",
  "spider-man: across the spider-verse": "Homem-Aranha: Através do Aranhaverso",
  "spider-man: into the spider-verse": "Homem-Aranha no Aranhaverso",
  "spider-man: brand new day": "Homem-Aranha: Brand New Day",
  "spider-man: far from home": "Homem-Aranha: Longe de Casa",
  "spider-man: homecoming": "Homem-Aranha: De Volta ao Lar",
  "the amazing spider-man": "O Espetacular Homem-Aranha",
  "the amazing spider-man 2": "O Espetacular Homem-Aranha 2",
  "avengers: endgame": "Vingadores: Ultimato",
  "avengers: infinity war": "Vingadores: Guerra Infinita",
  "avengers: age of ultron": "Vingadores: Era de Ultron",
  "the avengers": "Os Vingadores",
  "iron man": "Homem de Ferro",
  "captain america: civil war": "Capitão América: Guerra Civil",
  "captain america: the winter soldier": "Capitão América: O Soldado Invernal",
  "black panther": "Pantera Negra",
  "doctor strange": "Doutor Estranho",
  "guardians of the galaxy": "Guardiões da Galáxia",
  "thor: ragnarok": "Thor: Ragnarok",
  "black widow": "Viúva Negra",
  "deadpool": "Deadpool",
  "deadpool & wolverine": "Deadpool & Wolverine",
  "wolverine": "Wolverine",
  "x-men": "X-Men",
  "the flash": "Flash",
  "aquaman": "Aquaman",
  "wonder woman": "Mulher-Maravilha",
  "justice league": "Liga da Justiça",
  "the suicide squad": "O Esquadrão Suicida",
  "harry potter and the sorcerer's stone": "Harry Potter e a Pedra Filosofal",
  "harry potter and the philosopher's stone": "Harry Potter e a Pedra Filosofal",
  "harry potter and the chamber of secrets": "Harry Potter e a Câmara Secreta",
  "harry potter and the prisoner of azkaban": "Harry Potter e o Prisioneiro de Azkaban",
  "harry potter and the goblet of fire": "Harry Potter e o Cálice de Fogo",
  "harry potter and the order of the phoenix": "Harry Potter e a Ordem da Fênix",
  "harry potter and the half-blood prince": "Harry Potter e o Enigma do Príncipe",
  "harry potter and the deathly hallows: part 1": "Harry Potter e as Relíquias da Morte: Parte 1",
  "harry potter and the deathly hallows: part 2": "Harry Potter e as Relíquias da Morte: Parte 2",
  "star wars": "Star Wars",
  "the lord of the rings: the fellowship of the ring": "O Senhor dos Anéis: A Sociedade do Anel",
  "the lord of the rings: the two towers": "O Senhor dos Anéis: As Duas Torres",
  "the lord of the rings: the return of the king": "O Senhor dos Anéis: O Retorno do Rei",
  "the hobbit": "O Hobbit",
  "john wick": "John Wick: De Volta ao Jogo",
  "john wick: chapter 2": "John Wick: Um Novo Dia para Matar",
  "john wick: chapter 3 - parabellum": "John Wick: Capítulo 3  -  Parabellum",
  "john wick: chapter 4": "John Wick 4: Baba Yaga",
  "mission: impossible": "Missão: Impossível",
  "fast & furious": "Velozes e Furiosos",
  "the fast and the furious": "Velozes e Furiosos",
  "furious 7": "Velozes e Furiosos 7",
  "f9": "Velozes e Furiosos 9",
  "breaking bad": "Breaking Bad",
  "game of thrones": "Game of Thrones",
  "the walking dead": "The Walking Dead",
  "stranger things": "Stranger Things",
  "the office": "The Office",
  "friends": "Friends",
  "the witcher": "The Witcher",
  "wednesday": "Wandinha",
  "squid game": "Round 6",
  "one piece": "One Piece",
  "demon slayer": "Demon Slayer: Kimetsu no Yaiba",
  "attack on titan": "Attack on Titan",
  "jujutsu kaisen": "Jujutsu Kaisen",
  "my hero academia": "My Hero Academia",
  "naruto": "Naruto",
  "bleach": "Bleach",
  "dragon ball": "Dragon Ball",
  "inside out 2": "Divertida Mente 2",
  "inside out": "Divertida Mente",
  "frozen": "Frozen: Uma Aventura Congelante",
  "frozen ii": "Frozen 2",
  "toy story": "Toy Story",
  "the lion king": "O Rei Leão",
  "moana": "Moana: Um Mar de Aventuras",
  "moana 2": "Moana 2",
  "elemental": "Elementos",
  "encanto": "Encanto",
  "coco": "Viva: A Vida é uma Festa",
  "up": "Up: Altas Aventuras",
  "soul": "Soul",
  "luca": "Luca",
  "turning red": "Red: Crescer é uma Fera",
  "lightyear": "Lightyear",
  "cars": "Carros",
  "finding nemo": "Procurando Nemo",
  "finding dory": "Procurando Dory",
  "wall-e": "WALL·E",
  "ratatouille": "Ratatouille",
  "the incredibles": "Os Incríveis",
  "incredibles 2": "Os Incríveis 2",
  "despicable me": "Meu Malvado Favorito",
  "minions": "Minions",
  "shrek": "Shrek",
  "kung fu panda": "Kung Fu Panda",
  "how to train your dragon": "Como Treinar o Seu Dragão",
  "the super mario bros. movie": "Super Mario Bros.: O Filme",
  "minecraft": "Minecraft: O Filme",
  "a minecraft movie": "Minecraft: O Filme",
};

/** Substituições parciais de franchise (ordem importa) */
const PADROES: [RegExp, string][] = [
  [/\bSpider-Man\b/gi, "Homem-Aranha"],
  [/\bSpiderman\b/gi, "Homem-Aranha"],
  [/\bIron Man\b/gi, "Homem de Ferro"],
  [/\bCaptain America\b/gi, "Capitão América"],
  [/\bCaptain Marvel\b/gi, "Capitã Marvel"],
  [/\bBlack Panther\b/gi, "Pantera Negra"],
  [/\bDoctor Strange\b/gi, "Doutor Estranho"],
  [/\bGuardians of the Galaxy\b/gi, "Guardiões da Galáxia"],
  [/\bAvengers\b/gi, "Vingadores"],
  [/\bWonder Woman\b/gi, "Mulher-Maravilha"],
  [/\bJustice League\b/gi, "Liga da Justiça"],
  [/\bSuicide Squad\b/gi, "Esquadrão Suicida"],
  [/\bHarry Potter\b/gi, "Harry Potter"],
  [/\bLord of the Rings\b/gi, "Senhor dos Anéis"],
  [/\bStar Wars\b/gi, "Star Wars"],
  [/\bMission: Impossible\b/gi, "Missão: Impossível"],
  [/\bFast & Furious\b/gi, "Velozes e Furiosos"],
  [/\bFast and the Furious\b/gi, "Velozes e Furiosos"],
  [/\bJohn Wick\b/gi, "John Wick"],
  [/\bNo Way Home\b/gi, "Sem Volta para Casa"],
  [/\bFar From Home\b/gi, "Longe de Casa"],
  [/\bHomecoming\b/gi, "De Volta ao Lar"],
  [/\bAcross the Spider-Verse\b/gi, "Através do Aranhaverso"],
  [/\bInto the Spider-Verse\b/gi, "no Aranhaverso"],
  [/\bEndgame\b/gi, "Ultimato"],
  [/\bInfinity War\b/gi, "Guerra Infinita"],
  [/\bAge of Ultron\b/gi, "Era de Ultron"],
  [/\bCivil War\b/gi, "Guerra Civil"],
  [/\bWinter Soldier\b/gi, "O Soldado Invernal"],
  [/\bThe Batman\b/gi, "Batman"],
  [/\bThe Flash\b/gi, "Flash"],
  [/\bInside Out\b/gi, "Divertida Mente"],
  [/\bFinding Nemo\b/gi, "Procurando Nemo"],
  [/\bFinding Dory\b/gi, "Procurando Dory"],
  [/\bThe Lion King\b/gi, "O Rei Leão"],
  [/\bDespicable Me\b/gi, "Meu Malvado Favorito"],
  [/\bHow to Train Your Dragon\b/gi, "Como Treinar o Seu Dragão"],
  [/\bKung Fu Panda\b/gi, "Kung Fu Panda"],
  [/\bSquid Game\b/gi, "Round 6"],
  [/\bWednesday\b/gi, "Wandinha"],
  [/\bPart Two\b/gi, "Parte Dois"],
  [/\bPart 2\b/gi, "Parte 2"],
  [/\bChapter\b/gi, "Capítulo"],
];

function parecePortugues(texto: string): boolean {
  // Tem acentos comuns do PT ou palavras típicas
  if (/[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(texto)) return true;
  if (
    /\b(o|a|os|as|de|do|da|dos|das|um|uma|para|com|sem|no|na|em)\b/i.test(
      texto
    ) &&
    !/\b(the|and|of|for|with|from|into|across)\b/i.test(texto)
  ) {
    return true;
  }
  return false;
}

export function tituloEmPortugues(
  titulo?: string | null,
  tituloOriginal?: string | null
): string {
  const base = (titulo || tituloOriginal || "Sem título").trim();
  if (!base) return "Sem título";

  if (parecePortugues(base)) return base;

  const chave = base.toLowerCase().trim();
  if (MAPA_EXATO[chave]) return MAPA_EXATO[chave]!;

  // Tenta mapa no original
  if (tituloOriginal) {
    const chOrig = tituloOriginal.toLowerCase().trim();
    if (MAPA_EXATO[chOrig]) return MAPA_EXATO[chOrig]!;
  }

  let resultado = base;
  for (const [regex, subst] of PADROES) {
    resultado = resultado.replace(regex, subst);
  }

  return resultado;
}
