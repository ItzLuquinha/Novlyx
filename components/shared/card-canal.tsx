"use client";

import { ImagemPlaceholder as Image } from "@/components/shared/imagem-placeholder";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { Canal } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CardCanalProps {
  canal: Canal;
  ativo?: boolean;
  onSelecionar?: (canal: Canal) => void;
}

export function CardCanal({ canal, ativo = false, onSelecionar }: CardCanalProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelecionar?.(canal)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-novlyx-graphite text-left transition-colors",
        ativo
          ? "border-novlyx-accent shadow-lg shadow-novlyx-accent/10"
          : "border-white/10 hover:border-white/25"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-novlyx-graphite-light">
        <Image
          src={canal.logoUrl}
          alt={canal.nome}
          fill
          sizes="220px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {canal.aoVivo && (
          <Badge
            variant="destructive"
            className="absolute left-2 top-2 flex items-center gap-1 bg-red-600/90"
          >
            <Radio className="h-2.5 w-2.5" />
            AO VIVO
          </Badge>
        )}
        <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-novlyx-white">
          {canal.numero}
        </span>
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-semibold text-novlyx-white">
          {canal.nome}
        </p>
        {canal.programaAtual && (
          <p className="mt-0.5 truncate text-xs text-novlyx-gray-light">
            {canal.programaAtual}
          </p>
        )}
      </div>
    </motion.button>
  );
}
