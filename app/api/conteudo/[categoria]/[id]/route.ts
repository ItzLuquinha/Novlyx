import { NextResponse } from "next/server";
import { getFilmePorId } from "@/services/filmes.service";
import { getSeriePorId } from "@/services/series.service";
import { getAnimePorId } from "@/services/animes.service";
import { getDoramaPorId } from "@/services/doramas.service";
import { categoriaRotaSegura, idConteudoSeguro } from "@/lib/url-segura";

export async function GET(
  _request: Request,
  context: { params: Promise<{ categoria: string; id: string }> }
) {
  try {
    const { categoria: catRaw, id } = await context.params;
    const categoria = categoriaRotaSegura(catRaw);
    const idLimpo = idConteudoSeguro(id);
    if (!categoria || !idLimpo) {
      return NextResponse.json({ erro: "Parametros invalidos" }, { status: 400 });
    }

    let conteudo = null;
    if (categoria === "filme") conteudo = await getFilmePorId(idLimpo);
    else if (categoria === "serie") conteudo = await getSeriePorId(idLimpo);
    else if (categoria === "anime") conteudo = await getAnimePorId(idLimpo);
    else if (categoria === "dorama") conteudo = await getDoramaPorId(idLimpo);

    if (!conteudo) {
      return NextResponse.json({ erro: "Conteudo nao encontrado" }, { status: 404 });
    }
    return NextResponse.json(conteudo);
  } catch (erro) {
    console.error("[api/conteudo]", erro);
    return NextResponse.json({ erro: "Falha ao carregar" }, { status: 500 });
  }
}
