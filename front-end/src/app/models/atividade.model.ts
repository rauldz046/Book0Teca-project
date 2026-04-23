// Atende RF34 (logs de auditoria) e a timeline pessoal do usuario logado
// Mesmo modelo serve para as 2 visões; muda apenas o filtro no componente
export type TipoAtividade =
  | 'LOGIN'
  | 'LOGOUT'
  | 'EMPRESTIMO'
  | 'DEVOLUCAO'
  | 'RESERVA'
  | 'MULTA_APLICADA'
  | 'MULTA_PAGA'
  | 'CADASTRO'
  | 'EDICAO'
  | 'EXCLUSAO'
  | 'PERMISSAO_ALTERADA';

export type SeveridadeAtividade = 'INFO' | 'SUCESSO' | 'AVISO' | 'ERRO';

export interface Atividade {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  perfilUsuario:
    | 'LEITOR'
    | 'BIBLIOTECARIO'
    | 'FINANCEIRO'
    | 'ESTOQUE'
    | 'ADMINISTRADOR';
  tipo: TipoAtividade;
  descricao: string;
  entidadeAfetada?: string; // ex: 'livro:123', 'usuario:45'
  ipOrigem?: string;
  severidade: SeveridadeAtividade;
  dataHora: Date;
}
