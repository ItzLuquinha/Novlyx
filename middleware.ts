import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const m2 = pathname.match(
    /^\/conteudo\/(filme|serie|anime|dorama)\/([^/?#]+)\/?$/i
  );
  if (m2) {
    const url = request.nextUrl.clone();
    url.pathname = "/titulo";
    url.search = "";
    url.searchParams.set("c", m2[1]!.toLowerCase());
    url.searchParams.set("id", decodeURIComponent(m2[2]!));
    return NextResponse.redirect(url);
  }

  const m1 = pathname.match(/^\/conteudo\/([^/?#]+)\/?$/i);
  if (m1) {
    const id = decodeURIComponent(m1[1]!);
    const url = request.nextUrl.clone();
    url.pathname = "/titulo";
    url.search = "";
    const pref = id.match(/^(filme|serie|anime|dorama):/i);
    url.searchParams.set("c", pref ? pref[1]!.toLowerCase() : "serie");
    url.searchParams.set("id", id);
    return NextResponse.redirect(url);
  }

  const mp2 = pathname.match(
    /^\/player\/(filme|serie|anime|dorama)\/([^/?#]+)\/?$/i
  );
  if (mp2) {
    const url = request.nextUrl.clone();
    url.pathname = "/assistir";
    const keep = new URLSearchParams(request.nextUrl.search);
    url.search = "";
    url.searchParams.set("c", mp2[1]!.toLowerCase());
    url.searchParams.set("id", decodeURIComponent(mp2[2]!));
    keep.forEach((v, k) => {
      if (k !== "c" && k !== "id") url.searchParams.set(k, v);
    });
    return NextResponse.redirect(url);
  }

  const mp1 = pathname.match(/^\/player\/([^/?#]+)\/?$/i);
  if (mp1) {
    const url = request.nextUrl.clone();
    url.pathname = "/assistir";
    const keep = new URLSearchParams(request.nextUrl.search);
    url.search = "";
    url.searchParams.set("c", "serie");
    url.searchParams.set("id", decodeURIComponent(mp1[1]!));
    keep.forEach((v, k) => {
      if (k !== "c" && k !== "id") url.searchParams.set(k, v);
    });
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/conteudo/:path*", "/player/:path*"],
};
