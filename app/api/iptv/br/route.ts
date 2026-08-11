import { NextResponse } from "next/server";
import { Canal, CategoriaCanal } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLAYLIST_BR =
  "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_brazil.m3u8";
const PLAYLIST_FULL =
  "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8";

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parseM3U(text: string, soBrasil = false): Canal[] {
  const lines = text.split(/\r?\n/);
  const canais: Canal[] = [];
  let meta: {
    nome?: string;
    logo?: string;
    grupo?: string;
    id?: string;
    country?: string;
  } = {};

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      const nome = line.split(",").slice(1).join(",").trim();
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      const idMatch = line.match(/tvg-id="([^"]*)"/i);
      const countryMatch = line.match(/tvg-country="([^"]*)"/i);
      meta = {
        nome: nome.replace(/\s*[ⓈⓉⓎⒼ]\s*/g, " ").trim(),
        logo: logoMatch?.[1],
        grupo: groupMatch?.[1]?.split(";")[0]?.trim() || "Brazil",
        id: idMatch?.[1],
        country: countryMatch?.[1],
      };
      continue;
    }

    if (line.startsWith("#")) continue;
    if (!meta.nome) continue;
    if (!/^https?:\/\
      meta = {};
      continue;
    }

    if (soBrasil) {
      const g = (meta.grupo || "").toLowerCase();
      const c = (meta.country || "").toUpperCase();
      const isBr =
        c === "BR" ||
        g === "brazil" ||
        g === "brasil" ||
        (meta.id || "").toLowerCase().endsWith(".br");
      if (!isBr) {
        meta = {};
        continue;
      }
    }

    const grupo = meta.grupo || "Brazil";
    const idBase =
      slug(meta.id || meta.nome) || `canal-${canais.length + 1}`;

    let logo =
      meta.logo && /^https?:\/\
        ? meta.logo
        : `https://placehold.co/300x300/1a1a2e/d4af37/png?text=${encodeURIComponent(meta.nome.slice(0, 10))}`;

    canais.push({
      id: `${idBase}-${canais.length}`,
      nome: meta.nome.slice(0, 120),
      logoUrl: logo,
      categoriaId: slug(grupo) || "brazil",
      categoriaNome: grupo,
      descricao: `Free-TV · ${grupo}`,
      numero: canais.length + 1,
      aoVivo: true,
      streamUrl: line,
    });
    meta = {};
  }

  return canais;
}

export async function GET() {
  try {
    const [resBr, resFull] = await Promise.all([
      fetch(PLAYLIST_BR, {
        headers: { "User-Agent": "NOVLYX/1.0" },
        next: { revalidate: 3600 },
      }),
      fetch(PLAYLIST_FULL, {
        headers: { "User-Agent": "NOVLYX/1.0" },
        next: { revalidate: 3600 },
      }),
    ]);

    const canais: Canal[] = [];
    const visto = new Set<string>();

    if (resBr.ok) {
      for (const c of parseM3U(await resBr.text(), false)) {
        const key = c.streamUrl || c.nome;
        if (!visto.has(key)) {
          visto.add(key);
          canais.push(c);
        }
      }
    }

    if (resFull.ok) {
      for (const c of parseM3U(await resFull.text(), true)) {
        const key = c.streamUrl || c.nome;
        if (!visto.has(key)) {
          visto.add(key);
          canais.push({ ...c, numero: canais.length + 1 });
        }
      }
    }

    
    canais.forEach((c, i) => {
      c.numero = i + 1;
    });

    const map = new Map<string, CategoriaCanal>();
    for (const c of canais) {
      if (!map.has(c.categoriaId)) {
        map.set(c.categoriaId, { id: c.categoriaId, nome: c.categoriaNome });
      }
    }

    return NextResponse.json({
      canais,
      categorias: [...map.values()].sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      ),
      fonte: "Free-TV/IPTV",
      total: canais.length,
    });
  } catch (e) {
    console.error("[api/iptv/br]", e);
    return NextResponse.json(
      { error: "Erro interno", canais: [], categorias: [] },
      { status: 500 }
    );
  }
}
