// Reserva: contempla os 2 modos definidos no escopo
// 1. FILA_ESPERA  -> livro indisponível, usuário entra em fila
// 2. AGENDAMENTO  -> livro disponível, usuário agenda retirada futura
export type TipoReserva = 'FILA_ESPERA' | 'AGENDAMENTO';

export type StatusReserva =
  | 'AGUARDANDO' // Na fila, ainda não chegou a vez
  | 'DISPONIVEL' // Livro separado e pronto pra retirada
  | 'RETIRADO' // Virou empréstimo
  | 'CANCELADO' // Cancelado pelo usuário
  | 'EXPIRADO'; // Não retirou no prazo

export interface Reserva {
  id: number;
  livroId: number;
  livroTitulo: string;
  usuarioId: number;
  usuarioNome: string;
  matricula: string;
  tipo: TipoReserva;
  posicaoFila?: number; // usado em FILA_ESPERA
  dataSolicitacao: Date;
  dataAgendada?: Date; // usado em AGENDAMENTO
  dataLimiteRetirada?: Date; // prazo pra retirar após ficar DISPONIVEL
  status: StatusReserva;
}
