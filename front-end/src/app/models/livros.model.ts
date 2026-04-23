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
  created_at?: string;
  updated_at?: string;
  // Join com Autores
  autorInfo?: { NomeAutor: string };
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
