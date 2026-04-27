export type StatusCompra = 'Pendente' | 'Pago' | 'Cancelado' | 'Aguardando' | 'Reembolsado';

/** Endereço serializado dentro do registro de venda (snapshot histórico). */
export interface EnderecoEntrega {
  Logradouro?: string;
  Numero?: number | string | null;
  Bairro?: string;
  Cidade?: string;
  Estado?: string;
  CEP?: string;
  Complemento?: string;
}

export interface Venda {
  id: number;
  Livro: number;
  idUsuario: number;
  FuncionarioResponsavel?: number;
  CompraStatus: number;
  ValorCompra: number;
  ValorPago: number;
  // TC-COMP-04 / TC-COMP-06
  Quantidade?: number;
  enderecoEntrega?: EnderecoEntrega | null;
  formaPagamento?: string | null;
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
  // TC-COMP-04: passados ao backend para persistência
  enderecoEntrega?: EnderecoEntrega | null;
  formaPagamento?: string;
  // TC-COMP-06: default 1 se omitido
  Quantidade?: number;
}

export interface RelatorioVendas {
  vendas: Venda[];
  totalArrecadado: number;
}
