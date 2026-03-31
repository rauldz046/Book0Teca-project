export interface Transacao {
  id: number;
  data: Date;
  descricao: string;
  categoria: 'MULTA' | 'AQUISIÇÃO' | 'MANUTENÇÃO' | 'ASSINATURA' | 'OUTROS';
  tipo: 'ENTRADA' | 'SAIDA';
  valor: number;
  metodoPagamento: 'PIX' | 'BOLETO' | 'CARTÃO' | 'DINHEIRO' | 'TRANSFERÊNCIA';
  status: 'CONCLUIDO' | 'PENDENTE' | 'ESTORNADO';
}
