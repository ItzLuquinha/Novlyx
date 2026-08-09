"use client";

import { createContext, useContext, useState } from "react";
import { Perfil } from "@/types";
import { gerarPosterPlaceholder } from "@/utils/placeholder";

const PERFIL_PADRAO: Perfil = {
  id: "perfil-1",
  nome: "Convidado",
  avatarUrl: gerarPosterPlaceholder("Perfil", { largura: 200, altura: 200 }),
  principal: true,
};

interface PerfilContextType {
  perfil: Perfil;
  definirPerfil: (perfil: Perfil) => void;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export function PerfilProvider({ children }: { children: React.ReactNode }) {
  const [perfil, definirPerfil] = useState<Perfil>(PERFIL_PADRAO);

  return (
    <PerfilContext.Provider value={{ perfil, definirPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
}

export function usePerfil() {
  const contexto = useContext(PerfilContext);
  if (!contexto) {
    throw new Error("usePerfil deve ser usado dentro de PerfilProvider");
  }
  return contexto;
}
