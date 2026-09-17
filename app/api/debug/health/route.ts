import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    ok: true,
    time: new Date().toISOString(),
    node: process.version,
    env: {
      API_BASE: process.env.NEXT_PUBLIC_API_BASE_URL || "(default 2embed)",
      PLAYER_BASE: process.env.NEXT_PUBLIC_PLAYER_BASE_URL || "(default)",
      USAR_PROXY: process.env.NEXT_PUBLIC_USAR_PROXY ?? "(default true)",
      VERCEL: process.env.VERCEL || "0",
      VERCEL_ENV: process.env.VERCEL_ENV || "local",
    },
  };

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(
      "https://api.2embed.cc/trending?time_window=day&page=1",
      {
        signal: ctrl.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "NOVLYX-DEBUG/1.0",
        },
        cache: "no-store",
      }
    );
    clearTimeout(t);
    const text = await res.text();
    checks.upstream = {
      status: res.status,
      ok: res.ok,
      bytes: text.length,
      sample: text.slice(0, 120),
    };
  } catch (e) {
    checks.upstream = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
    checks.ok = false;
  }

  return NextResponse.json(checks, {
    status: checks.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
