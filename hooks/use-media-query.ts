"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [corresponde, setCorresponde] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setCorresponde(mediaQuery.matches);

    const handler = (evento: MediaQueryListEvent) => setCorresponde(evento.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return corresponde;
}
