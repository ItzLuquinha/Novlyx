"use client";

import { Bell } from "lucide-react";
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
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificacoes"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-novlyx-gold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Notificacoes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="font-medium">Novo lancamento disponivel</span>
            <span className="text-xs text-novlyx-gray-light">
              Um novo titulo foi adicionado ao catalogo
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex-col items-start gap-0.5">
            <span className="font-medium">Episodio disponivel</span>
            <span className="text-xs text-novlyx-gray-light">
              Continue assistindo de onde parou
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Menu do perfil"
            className="rounded-full ring-offset-2 ring-offset-novlyx-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-novlyx-gold/60"
          >
            <Avatar className="h-9 w-9 border border-novlyx-gold/30">
              <AvatarImage src={perfil.avatarUrl} alt={perfil.nome} />
              <AvatarFallback>{perfil.nome.charAt(0)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{perfil.nome}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Gerenciar perfis</DropdownMenuItem>
          <DropdownMenuItem>Configuracoes da conta</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
