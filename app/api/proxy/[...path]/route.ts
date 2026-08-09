import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy restrito para a API de catálogo (2embed).
 * - Só GET
 * - Host fixo (sem SSRF)
 * - Allowlist de caminhos
 * - Bloqueia path traversal
 * - Rate limit simples por IP
 */

const UPSTREAM = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.2embed.cc"
).replace(/\/$/, "");

const CAMINHOS_PERMITIDOS = new Set([
  "trending",
  "trendingtv",
  "movie",
  "tv",
  "search",
  "searchtv",
  "similar",
  "similartv",
]);

// Rate limit em memória (por instância)
const hits = new Map<string, { count: number; resetAt: number }>();
const LIMITE = 120; // req / minuto / IP
const JANELA_MS = 60_000;

function rateLimitOk(ip: string): boolean {
  const agora = Date.now();
  const atual = hits.get(ip);
  if (!atual || agora > atual.resetAt) {
    hits.set(ip, { count: 1, resetAt: agora + JANELA_MS });
    return true;
  }
  if (atual.count >= LIMITE) return false;
  atual.count += 1;
  return true;
}

function caminhoSeguro(segmentos: string[]): string | null {
  if (!segmentos.length || segmentos.length > 4) return null;
  for (const seg of segmentos) {
    if (!seg || seg === "." || seg === "..") return null;
    if (seg.includes("\\") || seg.includes("%") || seg.includes(":")) return null;
    // só letras, números, hífen, underscore
    if (!/^[a-zA-Z0-9_-]+$/.test(seg)) return null;
  }
  const base = segmentos[0]!.toLowerCase();
  if (!CAMINHOS_PERMITIDOS.has(base)) return null;
  return segmentos.join("/");
}

function querySegura(searchParams: URLSearchParams): string {
  const out = new URLSearchParams();
  for (const [k, v] of searchParams.entries()) {
    // chaves/valores curtos e sem caracteres de controle
    if (!/^[a-zA-Z0-9_]+$/.test(k)) continue;
    if (v.length > 200) continue;
    if (/[\u0000-\u001f]/.test(v)) continue;
    out.set(k, v);
  }
  return out.toString();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anon";

  if (!rateLimitOk(ip)) {
    return NextResponse.json(
      { erro: "Muitas requisições. Aguarde um momento." },
      { status: 429 }
    );
  }

  const { path } = await context.params;
  const caminho = caminhoSeguro(path);
  if (!caminho) {
    return NextResponse.json({ erro: "Caminho não permitido" }, { status: 400 });
  }

  const qs = querySegura(request.nextUrl.searchParams);
  const url = `${UPSTREAM}/${caminho}${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "NOVLYX/1.0" },
      cache: "no-store",
      // evita seguir redirects para outro host
      redirect: "manual",
    });

    // Se upstream redirecionar, não seguimos (anti-SSRF)
    if (res.status >= 300 && res.status < 400) {
      return NextResponse.json(
        { erro: "Redirect bloqueado" },
        { status: 502 }
      );
    }

    const body = await res.text();
    // limita tamanho da resposta (~2MB)
    if (body.length > 2_000_000) {
      return NextResponse.json({ erro: "Resposta grande demais" }, { status: 502 });
    }

    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (erro) {
    console.error("[proxy]", caminho, erro);
    return NextResponse.json(
      { erro: "Falha ao contatar a API upstream" },
      { status: 502 }
    );
  }
}

// Bloqueia outros métodos
export async function POST() {
  return NextResponse.json({ erro: "Método não permitido" }, { status: 405 });
}
