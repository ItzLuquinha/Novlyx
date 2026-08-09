"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LogoNovlyx } from "@/components/shared/logo-novlyx";
import { LINKS_NAVEGACAO } from "./nav-links";
import { cn } from "@/lib/utils";

export function MenuMobile() {
  const [aberto, setAberto] = useState(false);
  const pathname = usePathname();

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Abrir menu"
        onClick={() => setAberto(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <DialogContent className="left-0 top-0 h-full max-w-xs translate-x-0 translate-y-0 rounded-none border-r border-white/10 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left">
        <DialogTitle className="sr-only">Menu de navegacao</DialogTitle>
        <LogoNovlyx tamanho="sm" className="mb-6" />
        <nav className="flex flex-col gap-1">
          {LINKS_NAVEGACAO.map((link) => {
            const ativo =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAberto(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  ativo
                    ? "bg-novlyx-gold/10 text-novlyx-gold"
                    : "text-novlyx-gray-light hover:bg-white/5 hover:text-novlyx-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
