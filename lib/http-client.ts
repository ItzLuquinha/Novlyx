import { API_BASE_URL, USAR_PROXY } from "./api-config";

export class ErroApi extends Error {
  status: number;
  url: string;

  constructor(mensagem: string, status: number, url: string) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
    this.url = url;
  }
}

interface OpcoesRequisicao extends RequestInit {
  parametros?: Record<string, string | number | boolean | undefined>;
}

/** No browser usa proxy (evita CORS). No server chama a API direto. */
function deveUsarProxy(): boolean {
  return USAR_PROXY && typeof window !== "undefined";
}

function montarUrl(
  caminho: string,
  parametros?: OpcoesRequisicao["parametros"]
): string {
  if (caminho.startsWith("http")) {
    const url = new URL(caminho);
    if (parametros) {
      Object.entries(parametros).forEach(([chave, valor]) => {
        if (valor !== undefined) url.searchParams.set(chave, String(valor));
      });
    }
    return url.toString();
  }

  // Junta query params (caminho pode já ter ?imdb_id=...)
  const params = new URLSearchParams();
  const partes = caminho.split("?");
  const pathPart = partes[0] ?? caminho;
  const existingQuery = partes[1];
  if (existingQuery) {
    new URLSearchParams(existingQuery).forEach((v, k) => params.set(k, v));
  }
  if (parametros) {
    Object.entries(parametros).forEach(([chave, valor]) => {
      if (valor !== undefined) params.set(chave, String(valor));
    });
  }
  const qs = params.toString();
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;

  if (deveUsarProxy()) {
    return `/api/proxy${path}${qs ? `?${qs}` : ""}`;
  }

  // Server (ou proxy desligado): URL absoluta da 2embed
  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${base}${path}${qs ? `?${qs}` : ""}`;
}

export async function httpClient<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {}
): Promise<T> {
  const { parametros, ...init } = opcoes;
  const url = montarUrl(caminho, parametros);

  const resposta = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new ErroApi(
      `Falha na requisicao: ${resposta.status} ${resposta.statusText}`,
      resposta.status,
      url
    );
  }

  return resposta.json() as Promise<T>;
}
