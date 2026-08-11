"use client";

import Link from "next/link";
import { usePerfil } from "@/contexts/perfil-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function MenuPerfil() {
  const { perfil } = usePerfil();

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificacoes"
            className="relative h-10 w-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-novlyx-accent" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Notificações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-white/50" disabled>
            Nenhuma novidade por enquanto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-novlyx-accent"
            aria-label="Menu do perfil"
          >
            <Avatar className="h-9 w-9 border border-white/10 sm:h-10 sm:w-10">
              <AvatarImage src={perfil.avatarUrl} alt={perfil.nome} />
              <AvatarFallback>{perfil.nome.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium text-white">{perfil.nome}</p>
            <p className="text-xs text-white/40">Perfil neste dispositivo</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/conta">Gerenciar conta</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes">Configurações da conta</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/minha-lista">Minha Lista</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/historico">Histórico</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
