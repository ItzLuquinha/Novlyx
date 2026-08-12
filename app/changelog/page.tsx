import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog | NOVLYX",
  description: "Histórico completo de mudanças da NOVLYX.",
};

const ENTRADAS = [
  {
    data: "Agosto 2026",
    titulo: "Fontes BR, AdGuard, sorteio e app na tela inicial",
    itens: [
      "Removidas fontes Multiembed, 2Embed e VidSrc (ingles / muitos anuncios)",
      "Player so com fontes brasileiras: EmbedPlay (BR) e EmbedPlay Alt (BR2)",
      "Aviso obrigatorio recomendando AdGuard, com passos para PC, Android e iPhone",
      "Sorteio de filmes com filtro real de genero (sem misturar trending aleatorio)",
      "Sortear de novo respeita genero, epoca e nota minima",
      "Pagina /instalar: tutorial Apple (Safari → Compartilhar → Tela de Inicio) e Android",
      "Link Instalar app no rodape",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Trailers, watch party, sorteio e esportes ao vivo",
    itens: [
      "Trailer oficial (YouTube) na página de detalhe, quando a API envia o link",
      "Porque você viu X mais forte: prioriza Continuar assistindo + similares",
      "Watch party: link compartilhável com temporada/episódio e banner no player",
      "Me Surpreenda com mais perguntas (clima, gênero, época, duração)",
      "Esportes: placar e agenda via ESPN (Brasileirão, Premier, La Liga, Champions, NBA)",
      "Player com marca de progresso compacta (sem overlay em cima do vídeo)",
      "Aviso: placar não é transmissão do jogo - use TV ao vivo para canais",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Segurança e endurecimento",
    itens: [
      "Proxy da API com allowlist de caminhos (só rotas de catálogo)",
      "Bloqueio de path traversal e redirects no proxy",
      "Rate limit no proxy (~120 req/min por IP)",
      "Limite de tamanho da resposta do proxy",
      "Validação de URLs de stream e embed (só http/https)",
      "Validação de IDs em /conteudo e /player",
      "Headers de segurança: CSP, X-Frame-Options, nosniff, Referrer-Policy",
      "Permissions-Policy (camera/mic/geo bloqueados)",
      "poweredByHeader desligado",
      "Logos de IPTV só com URL http(s); senão placeholder",
      "iframe do player com referrerPolicy=no-referrer",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "TV ao vivo (Free-TV/IPTV)",
    itens: [
      "Fonte Free-TV/IPTV (GitHub) no lugar do iptv-org",
      "Playlist Brasil + canais BR da playlist global",
      "Player HLS (hls.js) para streams .m3u8",
      "Suporte a canais YouTube ao vivo (embed ou link externo)",
      "Favoritar canais (localStorage)",
      "Filtro por categoria e busca de canais",
      "Aviso de que canais podem ficar offline",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Home, estabilidade e UX",
    itens: [
      "Carregamento da home em lotes (menos falha em massa)",
      "Retry automático + botão Tentar novamente se o catálogo falhar",
      "Padding no topo quando o banner não carrega",
      "Fileira Porque você viu X (baseada no histórico)",
      "Trending BR na home",
      "Lançamentos da semana na home",
      "Medidor de conexão (Mbps) no final da home",
      "Botão Me Surpreenda em destaque no topo",
      "Remoção de todos os travessões (em dash) da interface",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Histórico, lista e compartilhar",
    itens: [
      "Página de histórico completo (/historico)",
      "Continuar assistindo estilo YouTube (tempo + barra no card)",
      "Progresso também na Minha Lista",
      "Botão Continuar no detalhe com minuto salvo",
      "Opção de limpar Continuar assistindo",
      "Botão compartilhar (Web Share API ou copiar link)",
      "Página Changelog (/changelog)",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Player e controle de progresso",
    itens: [
      "Player multi-fonte: EmbedPlay (BR), Multiembed, 2Embed, VidSrc",
      "Prioridade de fonte brasileira para dublagem/legendas quando possível",
      "Aviso antes do play: anúncios / possível +18 (fora do nosso controle)",
      "Checkbox para não mostrar o aviso de novo",
      "Salva temporada, episódio e tempo aproximado",
      "Atalhos: Espaço/Pause, F mudo, setas ±5s no progresso local",
      "Feedback visual dos atalhos (HUD)",
      "URL ?temporada=&episodio= respeitada ao abrir o player",
      "Temporadas/episódios placeholder na UI de séries (API não manda lista completa)",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Catálogo real (fim dos filmes falsos)",
    itens: [
      "Integração com API 2embed (metadados e trending)",
      "Proxy CORS para funcionar em localhost e produção",
      "Remoção total do catálogo mock de filmes/séries",
      "Adapters de resposta 2embed → modelo interno",
      "Detalhe por IMDb (tt…) ou TMDB",
      "Busca de filmes e séries na API",
      "Similares (API /similar e /similartv) para recomendações",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Organização por categoria",
    itens: [
      "Páginas separadas: Filmes, Séries, Animes, Doramas",
      "Filtros por categoria (idioma/gênero) para animes e doramas",
      "Filtro de gênero e ordenação nas listagens (recentes, nota, A-Z)",
      "Scroll infinito nas páginas de categoria",
      "Títulos em português quando mapeados (ex.: Homem-Aranha)",
      "Badge de qualidade mais realista (Cinema / HD / FULL HD)",
      "Detecção aproximada de títulos em cartaz (cinema)",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Sorteio, busca e descoberta",
    itens: [
      "Página Me Surpreenda (/sorteio): gênero + ano → filme aleatório",
      "Link de detalhes do sorteio corrigido (sem 404)",
      "Busca global (/busca) com debounce",
      "Busca instantânea no header",
      "Easter egg: digitar maite na busca abre página especial",
      "Página Maite (/maite) com animação minimalista",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Esportes, legal e rodapé",
    itens: [
      "Página Esportes com agenda ilustrativa (sem API de jogos reais)",
      "Gêneros locais estáveis (API 2embed não expõe endpoint de gêneros)",
      "Termos de Uso e Política de Privacidade",
      "Central de Ajuda",
      "E-mail de contato: rianbraga718@gmail.com",
      "Instagram @rian_pvcss no rodapé (promoção minimalista)",
      "Aviso legal: interface de agregação, não hospeda arquivos de vídeo",
    ],
  },
  {
    data: "Agosto 2026",
    titulo: "Base do app (início)",
    itens: [
      "Next.js App Router + React + Tailwind",
      "Layout: header, menu mobile, footer",
      "Home com banner em carrossel e fileiras de conteúdo",
      "Páginas de detalhe e player",
      "Minha Lista (localStorage)",
      "Perfis básicos (convidado)",
      "Design dark com acento dourado NOVLYX",
      "Tipos TypeScript para conteúdo, canais e eventos",
      "React Query para cache de listagens",
    ],
  },
];

export default function PaginaChangelog() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-16 lg:pt-24">
        <div className="container max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-novlyx-accent/80">
            NOVLYX
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Changelog</h1>
          <p className="mt-2 text-sm text-white/50">
            Histórico completo - tudo que entrou no app desde o início.
          </p>

          <div className="mt-10 space-y-10">
            {ENTRADAS.map((e, i) => (
              <section key={i}>
                <p className="text-xs text-white/35">{e.data}</p>
                <h2 className="mt-1 text-lg font-medium text-white">{e.titulo}</h2>
                <ul className="mt-3 space-y-1.5 border-l border-white/10 pl-4">
                  {e.itens.map((item) => (
                    <li key={item} className="text-sm text-white/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-12 text-xs text-white/35">
            <Link href="/" className="text-novlyx-accent hover:underline">
              Voltar ao início
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
