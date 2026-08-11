"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const LINKS_PRINCIPAIS = [
  { href: "/filmes", label: "Filmes" },
  { href: "/series", label: "Series" },
  { href: "/animes", label: "Animes" },
  { href: "/doramas", label: "Doramas" },
];

export const LINKS_EXTRA = [
  { href: "/", label: "Inicio" },
  { href: "/sorteio", label: "Surpresa" },
  { href: "/tv-ao-vivo", label: "TV ao Vivo" },
  { href: "/esportes", label: "Esportes" },
  { href: "/minha-lista", label: "Minha Lista" },
  { href: "/historico", label: "Historico" },
];

export const LINKS_NAVEGACAO = [...LINKS_PRINCIPAIS, ...LINKS_EXTRA];

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-0.5", className)}>
      {LINKS_PRINCIPAIS.map((link) => {
        const ativo = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              ativo
                ? "text-white"
                : "text-white/45 hover:text-white/85"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
