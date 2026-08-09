import { cn } from "@/lib/utils";

interface LogoNovlyxProps {
  className?: string;
  tamanho?: "sm" | "md" | "lg";
}

const TAMANHOS = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export function LogoNovlyx({ className, tamanho = "md" }: LogoNovlyxProps) {
  return (
    <span
      className={cn(
        "select-none font-display font-bold tracking-[0.18em]",
        TAMANHOS[tamanho],
        className
      )}
      aria-label="NOVLYX"
    >
      <span className="bg-gold-gradient bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(201,162,75,0.25)]">
        NOVLYX
      </span>
    </span>
  );
}
