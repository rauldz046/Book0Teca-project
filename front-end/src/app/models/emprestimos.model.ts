// Empréstimo como vem do banco (LivrosEmprestimos)
export interface EmprestimoDB {
  id: number;
  AutorizadoPor: number;
  idLivro: number;
  idUser: number;
  IdVistoria: number;
  created_at: string;
  updated_at?: string;
  // Joins
  livro?: { idLivro: number; Titulo: string; ISBN: string };
  usuario?: { idUsuario: number; Nome: string; Email: string };
  autorizador?: { idFuncionario: number; NomeFunc: string };
  vistoria?: { id: number; VistoriadoPor: number };
}

export interface RegistrarEmprestimoPayload {
  idLivro: number;
  idUser: number;
  AutorizadoPor: number;
  VistoriadoPor: number;
}

export interface ConfirmarDevolucaoPayload {
  idEmprestimo: number;
  VistoriadoPor: number;
  dataPrevisao: string; // ISO date string — base para cálculo de multa
}

export interface RespostaDevolucao {
  message: string;
  multaAplicada: number;
  aviso: string | null;
}

// Mantendo as interfaces antigas para compatibilidade com os components já escritos
export interface Emprestimo {
  id: number;
  leitor: string;
  matricula: string;
  livroTitulo: string;
  dataEmprestimo: Date;
  dataPrevisaoDevolucao: Date;
  renovacoes: number;
  status: 'ATIVO' | 'ATRASADO' | 'DEVOLVIDO';
}

export interface EmprestimoAtivo {
  id: number;
  livroTitulo: string;
  usuarioNome: string;
  dataEmprestimo: Date;
  dataPrevisaoDevolucao: Date;
  diasAtraso: number;
  multaCalculada: number;
  situacaoLivro?: string;
}
