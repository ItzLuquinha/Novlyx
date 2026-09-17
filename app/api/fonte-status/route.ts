import { NextRequest, NextResponse } from "next/server";
import { PLAYER_BASE_URL } from "@/lib/api-config";

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider") || "embedplay";
  const tmdb = request.nextUrl.searchParams.get("tmdb");
  const imdb = request.nextUrl.searchParams.get("imdb");
  const type = request.nextUrl.searchParams.get("type") === "tv" ? "tv" : "movie";
  const season = request.nextUrl.searchParams.get("season");
  const episode = request.nextUrl.searchParams.get("episode");

  if (provider !== "embedplay") {
    return NextResponse.json({ available: true, provider });
  }

  const idParam = tmdb
    ? `tmdb=${encodeURIComponent(tmdb)}`
    : imdb
      ? `imdb=${encodeURIComponent(imdb)}`
      : null;
  if (!idParam) {
    return NextResponse.json({ available: false, reason: "sem-id" });
  }

  const base = PLAYER_BASE_URL.replace(/\/$/, "");
  let url = `${base}/api/status?${idParam}&type=${type === "tv" ? "tv" : "movie"}`;
  if (type === "tv" && season && episode) {
    url += `&sea=${encodeURIComponent(season)}&epi=${encodeURIComponent(episode)}`;
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "NOVLYX/1.0" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { available: false, status: res.status },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
    const body = await res.json().catch(() => ({}));
    const available =
      body?.status === true ||
      body?.available === true ||
      body?.exists === true ||
      body?.ok === true ||
      res.ok;
    return NextResponse.json(
      { available, provider, raw: body },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { available: true, provider, skipped: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
