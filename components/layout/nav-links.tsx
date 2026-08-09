"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS_NAVEGACAO = [
  { href: "/", label: "Inicio" },
  { href: "/filmes", label: "Filmes" },
  { href: "/sorteio", label: "Surpresa" },
  { href: "/series", label: "Series" },
  { href: "/animes", label: "Animes" },
  { href: "/doramas", label: "Doramas" },
  { href: "/tv-ao-vivo", label: "TV ao Vivo" },
  { href: "/esportes", label: "Esportes" },
  { href: "/minha-lista", label: "Minha Lista" },
  { href: "/historico", label: "Historico" },
];

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {LINKS_NAVEGACAO.map((link) => {
        const ativo =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              ativo
                ? "text-novlyx-gold"
                : "text-novlyx-gray-light hover:text-novlyx-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { LINKS_NAVEGACAO };
