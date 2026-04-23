export type StatusCompra = 'Pendente' | 'Pago' | 'Cancelado' | 'Aguardando' | 'Reembolsado';

export interface Venda {
  id: number;
  Livro: number;
  idUsuario: number;
  FuncionarioResponsavel?: number;
  CompraStatus: number;
  ValorCompra: number;
  ValorPago: number;
  DataCompra: string;
  created_at?: string;
  updated_at?: string;
  // Joins
  livro?: { idLivro: number; Titulo: string; LivroFisico: number; LivroDigital: number };
  usuario?: { idUsuario: number; Nome: string; Email: string };
  funcionario?: { idFuncionario: number; NomeFunc: string };
  status?: { Descricao: StatusCompra };
}

export interface RegistrarVendaPayload {
  idLivro: number;
  idUsuario: number;
  FuncionarioResponsavel?: number;
  ValorPago?: number;
}

export interface RelatorioVendas {
  vendas: Venda[];
  totalArrecadado: number;
}
