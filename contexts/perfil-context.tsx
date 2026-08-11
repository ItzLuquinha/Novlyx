"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Perfil } from "@/types";
import { gerarPosterPlaceholder } from "@/utils/placeholder";

const CHAVE = "novlyx-perfil";

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
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_PADRAO);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (raw) {
        const parsed = JSON.parse(raw) as Perfil;
        if (parsed?.nome) setPerfil({ ...PERFIL_PADRAO, ...parsed });
      }
    } catch {
      
    }
  }, []);

  function definirPerfil(novo: Perfil) {
    setPerfil(novo);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novo));
    } catch {
      
    }
  }

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
