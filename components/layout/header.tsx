"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoNovlyx } from "@/components/shared/logo-novlyx";
import { NavLinks } from "./nav-links";
import { BuscaInstantanea } from "./busca-instantanea";
import { MenuPerfil } from "./menu-perfil";
import { MenuMobile } from "./menu-mobile";

export function Header() {
  const [rolado, setRolado] = useState(false);
  const [buscaMobileAberta, setBuscaMobileAberta] = useState(false);

  useEffect(() => {
    function aoRolar() {
      setRolado(window.scrollY > 24);
    }
    window.addEventListener("scroll", aoRolar);
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        rolado
          ? "bg-novlyx-black/95 backdrop-blur-md shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-2 lg:h-20 lg:gap-4">
        <div className="flex min-w-0 items-center gap-3 lg:gap-8">
          <MenuMobile />
          <Link href="/" aria-label="Pagina inicial NOVLYX" className="shrink-0">
            <LogoNovlyx tamanho="sm" className="lg:hidden" />
            <LogoNovlyx tamanho="md" className="hidden lg:inline-flex" />
          </Link>
          <NavLinks className="hidden lg:flex" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Desktop / tablet */}
          <div className="hidden sm:block">
            <BuscaInstantanea />
          </div>

          {/* Mobile: ícone abre busca ou vai para /busca */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 sm:hidden"
            aria-label="Pesquisar"
            onClick={() => setBuscaMobileAberta((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </button>

          <MenuPerfil />
        </div>
      </div>

      {/* Barra de busca mobile expandida */}
      {buscaMobileAberta && (
        <div className="border-t border-white/10 bg-novlyx-black/95 px-3 py-2 sm:hidden">
          <BuscaInstantanea />
          <Link
            href="/busca"
            className="mt-2 block text-center text-xs text-novlyx-gold"
            onClick={() => setBuscaMobileAberta(false)}
          >
            Busca completa
          </Link>
        </div>
      )}
    </header>
  );
}
