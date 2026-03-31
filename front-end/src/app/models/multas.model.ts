export interface Multa {
  id: number;
  usuario: string;
  livro: string;
  dataVencimento: Date;
  valor: number;
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  diasAtraso: number;
}
