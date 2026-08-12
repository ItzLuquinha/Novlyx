import Link from "next/link";
import { LogoNovlyx } from "@/components/shared/logo-novlyx";
import { Separator } from "@/components/ui/separator";

const COLUNAS_FOOTER = [
  {
    titulo: "Navegacao",
    links: [
      { href: "/filmes", label: "Filmes" },
      { href: "/series", label: "Series" },
      { href: "/animes", label: "Animes" },
      { href: "/doramas", label: "Doramas" },
    ],
  },
  {
    titulo: "Ao Vivo",
    links: [
      { href: "/tv-ao-vivo", label: "TV ao Vivo" },
      { href: "/esportes", label: "Esportes" },
      { href: "/minha-lista", label: "Minha Lista" },
    ],
  },
  {
    titulo: "Suporte",
    links: [
      { href: "/central-de-ajuda", label: "Central de Ajuda" },
      { href: "/termos", label: "Termos de Uso" },
      { href: "/privacidade", label: "Privacidade" },
      { href: "/changelog", label: "Changelog" },
      { href: "/instalar", label: "Instalar app" },
      { href: "/historico", label: "Historico" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-novlyx-graphite/40 py-14">
      <div className="container">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="max-w-xs">
            <LogoNovlyx tamanho="sm" />
            <p className="mt-4 text-sm leading-relaxed text-novlyx-gray-light">
              A NOVLYX reune filmes, series, animes e doramas em uma unica
              plataforma, feita para voce assistir do seu jeito.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUNAS_FOOTER.map((coluna) => (
              <div key={coluna.titulo}>
                <h3 className="mb-3 text-sm font-semibold text-novlyx-white">
                  {coluna.titulo}
                </h3>
                <ul className="flex flex-col gap-2">
                  {coluna.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-novlyx-gray-light transition-colors hover:text-novlyx-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-xs text-novlyx-gray-light sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 max-w-xl">
            <p>
              NOVLYX © {new Date().getFullYear()}. Interface de agregação - 
              não hospedamos arquivos de vídeo. Conteúdos e players pertencem a
              seus respectivos titulares e provedores de terceiros.
            </p>
            <p className="text-white/35">
              Ao continuar navegando, você declara ter lido os{" "}
              <Link href="/termos" className="text-novlyx-accent/80 hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link
                href="/privacidade"
                className="text-novlyx-accent/80 hover:underline"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
          <a
            href="https://instagram.com/rian_pvcss"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-white/35 transition-colors hover:text-novlyx-accent/80"
          >
            Instagram · @rian_pvcss
          </a>
        </div>
      </div>
    </footer>
  );
}
