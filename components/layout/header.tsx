"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoNovlyx } from "@/components/shared/logo-novlyx";
import { NavLinks } from "./nav-links";
import { BuscaInstantanea } from "./busca-instantanea";
import { MenuPerfil } from "./menu-perfil";
import { MenuMobile } from "./menu-mobile";

export function Header() {
  const [rolado, setRolado] = useState(false);

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
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-20">
        <div className="flex items-center gap-8">
          <MenuMobile />
          <Link href="/" aria-label="Pagina inicial NOVLYX">
            <LogoNovlyx tamanho="sm" className="lg:hidden" />
            <LogoNovlyx tamanho="md" className="hidden lg:inline-flex" />
          </Link>
          <NavLinks className="hidden lg:flex" />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <BuscaInstantanea />
          </div>
          <MenuPerfil />
        </div>
      </div>
    </header>
  );
}
