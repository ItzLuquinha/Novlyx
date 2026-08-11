"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BotaoCompartilharProps {
  titulo: string;
  texto?: string;
  url?: string;
}

export function BotaoCompartilhar({
  titulo,
  texto,
  url,
}: BotaoCompartilharProps) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    const link =
      url ||
      (typeof window !== "undefined" ? window.location.href : "");
    const payload = {
      title: `NOVLYX · ${titulo}`,
      text: texto || `Olha isso na NOVLYX: ${titulo}`,
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="lg"
      onClick={() => void compartilhar()}
      className="gap-2"
    >
      {copiado ? (
        <>
          <Check className="h-5 w-5 text-emerald-400" />
          Link copiado
        </>
      ) : (
        <>
          <Share2 className="h-5 w-5" />
          Compartilhar
        </>
      )}
    </Button>
  );
}
