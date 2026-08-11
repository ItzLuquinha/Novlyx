export interface CategoriaCanal {
  id: string;
  nome: string;
}

export interface Canal {
  id: string;
  nome: string;
  logoUrl: string;
  categoriaId: string;
  categoriaNome: string;
  descricao: string;
  numero: number;
  aoVivo: boolean;
  programaAtual?: string;
  
  streamUrl?: string;
}
