export interface Livro {
  idLivro: number;
  Titulo: string;
  ISBN: string;
  Autor: number;
  LivroFisico: 0 | 1;
  LivroDigital: 0 | 1;
  QtdLivros: number;
  PrecoCompra: number;
  PrecoVenda: number;
  PathDownload?: string;
  PalavrasChave?: any;
  Descricao?: string;
  Capa?: string;          // URL da capa (persistida no banco)
  Ano?: number;           // ano de publicação
  created_at?: string;
  updated_at?: string;
  // Campos derivados/enrich vindos do back
  autorInfo?: { NomeAutor: string };
  capa?: string;          // alias lowercase (enrichLivro)
  titulo?: string;
  status?: string;
  ano?: number;
  favorito?: boolean;
}

export interface EntradaEstoque {
  idLivro: number;
  quantidade: number;
}

export interface FiltroBuscaLivro {
  titulo?: string;
  autorId?: number;
  tipo?: 'fisico' | 'digital';
}
