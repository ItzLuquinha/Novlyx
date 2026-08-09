import { Canal, CategoriaCanal } from "@/types";

export const CATEGORIAS_CANAIS: CategoriaCanal[] = [
  { id: "abertos", nome: "Abertos" },
  { id: "esportes", nome: "Esportes" },
  { id: "noticias", nome: "Notícias" },
  { id: "filmes-series", nome: "Filmes e Séries" },
  { id: "infantil", nome: "Infantil" },
  { id: "documentarios", nome: "Documentários" },
  { id: "musica", nome: "Música" },
];

function logo(nome: string): string {
  const cores = ["1a1a2e", "16213e", "0f3460", "1b1b2f", "2d132c", "1a472a"];
  const hash = nome.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = cores[hash % cores.length];
  const inicial = encodeURIComponent(nome.slice(0, 12));
  return `https://placehold.co/300x300/${bg}/d4af37/png?text=${inicial}&font=roboto`;
}

const DADOS: Omit<Canal, "logoUrl" | "categoriaNome" | "descricao" | "aoVivo">[] = [
  { id: "globo", nome: "TV Globo", categoriaId: "abertos", numero: 1, programaAtual: "Jornal Nacional" },
  { id: "sbt", nome: "SBT", categoriaId: "abertos", numero: 4, programaAtual: "Programa do Ratinho" },
  { id: "record", nome: "Record TV", categoriaId: "abertos", numero: 7, programaAtual: "Cidade Alerta" },
  { id: "band", nome: "Band", categoriaId: "abertos", numero: 13, programaAtual: "Brasil Urgente" },
  { id: "rede-tv", nome: "RedeTV!", categoriaId: "abertos", numero: 9, programaAtual: "Encrenca" },
  { id: "cultura", nome: "TV Cultura", categoriaId: "abertos", numero: 2, programaAtual: "Jornal da Cultura" },
  { id: "sportv", nome: "SporTV", categoriaId: "esportes", numero: 20, programaAtual: "Troca de Passes" },
  { id: "sportv2", nome: "SporTV 2", categoriaId: "esportes", numero: 21, programaAtual: "Esporte em Debate" },
  { id: "sportv3", nome: "SporTV 3", categoriaId: "esportes", numero: 22, programaAtual: "Premiere" },
  { id: "premiere", nome: "Premiere", categoriaId: "esportes", numero: 23, programaAtual: "Brasileirão ao vivo" },
  { id: "espn", nome: "ESPN", categoriaId: "esportes", numero: 24, programaAtual: "SportsCenter" },
  { id: "espn2", nome: "ESPN 2", categoriaId: "esportes", numero: 25, programaAtual: "NBA" },
  { id: "combate", nome: "Combate", categoriaId: "esportes", numero: 26, programaAtual: "UFC" },
  { id: "band-sports", nome: "BandSports", categoriaId: "esportes", numero: 27, programaAtual: "Os Donos da Bola" },
  { id: "globo-news", nome: "GloboNews", categoriaId: "noticias", numero: 40, programaAtual: "Jornal GloboNews" },
  { id: "cnn-brasil", nome: "CNN Brasil", categoriaId: "noticias", numero: 41, programaAtual: "CNN 360" },
  { id: "band-news", nome: "BandNews", categoriaId: "noticias", numero: 42, programaAtual: "Jornal BandNews" },
  { id: "record-news", nome: "Record News", categoriaId: "noticias", numero: 43, programaAtual: "JR News" },
  { id: "bbc", nome: "BBC World", categoriaId: "noticias", numero: 44, programaAtual: "World News" },
  { id: "telecine", nome: "Telecine Premium", categoriaId: "filmes-series", numero: 50, programaAtual: "Sessão Premium" },
  { id: "telecine-action", nome: "Telecine Action", categoriaId: "filmes-series", numero: 51, programaAtual: "Ação 24h" },
  { id: "hbo", nome: "HBO", categoriaId: "filmes-series", numero: 52, programaAtual: "Séries HBO" },
  { id: "warner", nome: "Warner Channel", categoriaId: "filmes-series", numero: 53, programaAtual: "Séries Warner" },
  { id: "fx", nome: "FX", categoriaId: "filmes-series", numero: 54, programaAtual: "Séries FX" },
  { id: "universal", nome: "Universal TV", categoriaId: "filmes-series", numero: 55, programaAtual: "Séries Universal" },
  { id: "gnt", nome: "GNT", categoriaId: "filmes-series", numero: 56, programaAtual: "Saia Justa" },
  { id: "multishow", nome: "Multishow", categoriaId: "musica", numero: 60, programaAtual: "TVZ" },
  { id: "mtv", nome: "MTV", categoriaId: "musica", numero: 61, programaAtual: "Clipe MTV" },
  { id: "bis", nome: "Bis", categoriaId: "musica", numero: 62, programaAtual: "Shows" },
  { id: "gloob", nome: "Gloob", categoriaId: "infantil", numero: 70, programaAtual: "Desenhos" },
  { id: "cartoon", nome: "Cartoon Network", categoriaId: "infantil", numero: 71, programaAtual: "CN" },
  { id: "discovery-kids", nome: "Discovery Kids", categoriaId: "infantil", numero: 72, programaAtual: "Kids" },
  { id: "nick", nome: "Nickelodeon", categoriaId: "infantil", numero: 73, programaAtual: "Nick" },
  { id: "discovery", nome: "Discovery Channel", categoriaId: "documentarios", numero: 80, programaAtual: "Documentários" },
  { id: "natgeo", nome: "National Geographic", categoriaId: "documentarios", numero: 81, programaAtual: "NatGeo" },
  { id: "history", nome: "History", categoriaId: "documentarios", numero: 82, programaAtual: "History" },
  { id: "animal", nome: "Animal Planet", categoriaId: "documentarios", numero: 83, programaAtual: "Animais" },
];

export const CANAIS: Canal[] = DADOS.map((c) => {
  const cat = CATEGORIAS_CANAIS.find((x) => x.id === c.categoriaId)!;
  return {
    ...c,
    logoUrl: logo(c.nome),
    categoriaNome: cat.nome,
    descricao: `${c.nome} - canal ${cat.nome.toLowerCase()}. Programação ilustrativa na NOVLYX.`,
    aoVivo: true,
  };
});
