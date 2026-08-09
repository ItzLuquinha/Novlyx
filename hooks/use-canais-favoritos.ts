"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EVENTO_CANAIS_FAV,
  alternarCanalFavorito,
  getCanaisFavoritosIds,
} from "@/services/canais-favoritos.service";

export function useCanaisFavoritos() {
  const [ids, setIds] = useState<string[]>([]);

  const recarregar = useCallback(() => {
    setIds(getCanaisFavoritosIds());
  }, []);

  useEffect(() => {
    recarregar();
    window.addEventListener(EVENTO_CANAIS_FAV, recarregar);
    return () => window.removeEventListener(EVENTO_CANAIS_FAV, recarregar);
  }, [recarregar]);

  const alternar = useCallback((id: string) => {
    alternarCanalFavorito(id);
    recarregar();
  }, [recarregar]);

  return { ids, alternar, isFavorito: (id: string) => ids.includes(id) };
}
