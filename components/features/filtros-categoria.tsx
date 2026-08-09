"use client";

import { Genero } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type OpcaoOrdenacao =
  | "recentes"
  | "populares"
  | "melhorAvaliados"
  | "alfabetica";

interface FiltrosCategoriaProps {
  generos: Genero[];
  generoSelecionado?: string;
  ordenacao: OpcaoOrdenacao;
  onMudarGenero: (generoId: string | undefined) => void;
  onMudarOrdenacao: (ordenacao: OpcaoOrdenacao) => void;
}

const OPCOES_ORDENACAO: { valor: OpcaoOrdenacao; label: string }[] = [
  { valor: "recentes", label: "Mais Recentes" },
  { valor: "populares", label: "Populares" },
  { valor: "melhorAvaliados", label: "Melhor Avaliados" },
  { valor: "alfabetica", label: "Ordem Alfabetica" },
];

export function FiltrosCategoria({
  generos,
  generoSelecionado,
  ordenacao,
  onMudarGenero,
  onMudarOrdenacao,
}: FiltrosCategoriaProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={generoSelecionado ?? "todos"}
        onValueChange={(valor) =>
          onMudarGenero(valor === "todos" ? undefined : valor)
        }
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Genero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os generos</SelectItem>
          {generos.map((genero) => (
            <SelectItem key={genero.id} value={genero.id}>
              {genero.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={ordenacao}
        onValueChange={(valor) => onMudarOrdenacao(valor as OpcaoOrdenacao)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {OPCOES_ORDENACAO.map((opcao) => (
            <SelectItem key={opcao.valor} value={opcao.valor}>
              {opcao.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
