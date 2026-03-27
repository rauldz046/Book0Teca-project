export interface Emprestimo {
  id?: number;
  livroTitulo: string;
  usuarioNome: string;
  dataEmprestimo: Date;
  dataPrevisaoDevolucao: Date;
  dataDevolucaoReal?: Date;
  status: 'ATIVO' | 'DEVOLVIDO' | 'ATRASADO' | 'RENOVADO';
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
