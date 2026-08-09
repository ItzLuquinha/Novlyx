const PALETA_FUNDOS = [
  ["#1f1f1f", "#050505"],
  ["#2a2118", "#0a0806"],
  ["#1a1a1a", "#000000"],
  ["#241c12", "#0d0a06"],
  ["#181818", "#040404"],
];

function hashTexto(texto: string): number {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function quebrarLinhas(texto: string, maxCaracteres: number): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let linhaAtual = "";

  palavras.forEach((palavra) => {
    if ((linhaAtual + " " + palavra).trim().length > maxCaracteres) {
      if (linhaAtual) linhas.push(linhaAtual.trim());
      linhaAtual = palavra;
    } else {
      linhaAtual = (linhaAtual + " " + palavra).trim();
    }
  });

  if (linhaAtual) linhas.push(linhaAtual.trim());
  return linhas.slice(0, 3);
}

interface OpcoesPlaceholder {
  largura?: number;
  altura?: number;
  exibirMarca?: boolean;
}

export function gerarPosterPlaceholder(
  titulo: string,
  opcoes: OpcoesPlaceholder = {}
): string {
  const { largura = 400, altura = 600 } = opcoes;
  const indice = hashTexto(titulo) % PALETA_FUNDOS.length;
  const paleta = PALETA_FUNDOS[indice] ?? PALETA_FUNDOS[0]!;
  const [corClara, corEscura] = paleta;
  const linhas = quebrarLinhas(titulo.toUpperCase(), 16);
  const centroY = altura / 2;
  const gradId = `g${hashTexto(titulo)}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${corClara}"/>
        <stop offset="100%" stop-color="${corEscura}"/>
      </linearGradient>
    </defs>
    <rect width="${largura}" height="${altura}" fill="url(#${gradId})"/>
    <rect width="${largura}" height="${altura}" fill="none" stroke="#c9a24b" stroke-opacity="0.15" stroke-width="2"/>
    <circle cx="${largura / 2}" cy="${centroY - linhas.length * 14 - 30}" r="18" fill="none" stroke="#c9a24b" stroke-width="1.5" stroke-opacity="0.6"/>
    <text x="${largura / 2}" y="${centroY - linhas.length * 14 - 24}" font-family="Georgia, serif" font-size="18" fill="#c9a24b" text-anchor="middle" dominant-baseline="middle">N</text>
    ${linhas
      .map(
        (linha, i) =>
          `<text x="${largura / 2}" y="${centroY + i * 26}" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="#f5f4f2" text-anchor="middle" letter-spacing="0.5">${escaparXml(linha)}</text>`
      )
      .join("")}
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function gerarBannerPlaceholder(
  titulo: string,
  opcoes: OpcoesPlaceholder = {}
): string {
  const { largura = 1600, altura = 900 } = opcoes;
  const indice = hashTexto(titulo + "banner") % PALETA_FUNDOS.length;
  const paleta = PALETA_FUNDOS[indice] ?? PALETA_FUNDOS[0]!;
  const [corClara, corEscura] = paleta;
  const gradId = `bg${hashTexto(titulo)}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
    <defs>
      <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${corClara}"/>
        <stop offset="100%" stop-color="${corEscura}"/>
      </linearGradient>
      <radialGradient id="glow${gradId}" cx="30%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#c9a24b" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#c9a24b" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${largura}" height="${altura}" fill="url(#${gradId})"/>
    <rect width="${largura}" height="${altura}" fill="url(#glow${gradId})"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function escaparXml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
