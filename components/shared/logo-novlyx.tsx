import { cn } from "@/lib/utils";

interface LogoNovlyxProps {
  className?: string;
  tamanho?: "sm" | "md" | "lg";
}

const TAMANHOS = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

export function LogoNovlyx({ className, tamanho = "md" }: LogoNovlyxProps) {
  return (
    <span
      className={cn(
        "select-none font-display font-bold tracking-[0.14em] text-white",
        TAMANHOS[tamanho],
        className
      )}
      aria-label="NOVLYX"
    >
      NOVLYX
    </span>
  );
}
