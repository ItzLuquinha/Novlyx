import Link from "next/link";
import { Genero } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ListaGeneros({ generos }: { generos: Genero[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {generos.map((genero) => (
        <Badge key={genero.id} variant="outline">
          {genero.nome}
        </Badge>
      ))}
    </div>
  );
}
