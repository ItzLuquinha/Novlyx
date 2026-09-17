import { NextResponse } from "next/server";
import { getConteudoPorCategoria } from "@/services";
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

    const conteudo = await getConteudoPorCategoria(categoria, idLimpo);
    if (!conteudo) {
      return NextResponse.json({ erro: "Conteudo nao encontrado" }, { status: 404 });
    }

    return NextResponse.json(conteudo, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (erro) {
    console.error("[api/conteudo]", erro);
    return NextResponse.json(
      { erro: "Falha ao carregar conteudo" },
      { status: 500 }
    );
  }
}
