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
  situacaoLivro?: string; // 'Excelente', 'Bom', 'Avariado', 'Perdido'
}
