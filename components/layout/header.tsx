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
  const [buscaMobileAberta, setBuscaMobileAberta] = useState(false);

  useEffect(() => {
    function aoRolar() {
      setRolado(window.scrollY > 20);
    }
    window.addEventListener("scroll", aoRolar);
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        rolado ? "bg-novlyx-black/95" : "bg-transparent"
      )}
    >
      <div className="container flex h-14 items-center justify-between gap-3 lg:h-16">
        <div className="flex min-w-0 items-center gap-5 lg:gap-10">
          <MenuMobile />
          <Link href="/" aria-label="Pagina inicial NOVLYX" className="shrink-0">
            <LogoNovlyx tamanho="sm" className="lg:hidden" />
            <LogoNovlyx tamanho="md" className="hidden lg:inline-flex" />
          </Link>
          <NavLinks className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <BuscaInstantanea />
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/60 hover:bg-white/8 hover:text-white sm:hidden"
            aria-label="Pesquisar"
            onClick={() => setBuscaMobileAberta((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <MenuPerfil />
        </div>
      </div>

      {buscaMobileAberta && (
        <div className="border-t border-white/8 bg-novlyx-black/95 px-3 py-2 sm:hidden">
          <BuscaInstantanea />
          <Link
            href="/busca"
            className="mt-2 block text-center text-xs text-novlyx-accent"
            onClick={() => setBuscaMobileAberta(false)}
          >
            Busca completa
          </Link>
        </div>
      )}
    </header>
  );
}
