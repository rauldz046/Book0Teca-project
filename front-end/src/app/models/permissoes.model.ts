// RBAC conforme definido: 5 perfis fixos
export type UserProfile =
  | 'LEITOR'
  | 'BIBLIOTECARIO'
  | 'FINANCEIRO'
  | 'ESTOQUE'
  | 'ADMINISTRADOR';

// Modulos/ações controlados pelas permissoes (escopo inicial do TAP)
export type AcaoPermissao =
  | 'USUARIOS_GERENCIAR'
  | 'FUNCIONARIOS_GERENCIAR'
  | 'ACERVO_CADASTRAR'
  | 'ACERVO_VISUALIZAR'
  | 'EMPRESTIMOS_REGISTRAR'
  | 'DEVOLUCOES_CONFIRMAR'
  | 'RESERVAS_GERENCIAR'
  | 'MULTAS_APLICAR'
  | 'FINANCEIRO_BAIXAR_BOLETO'
  | 'RELATORIOS_VISUALIZAR'
  | 'SISTEMA_CONFIGURAR';

export interface Perfil {
  id: number;
  nome: UserProfile;
  descricao: string;
  totalUsuarios: number;
  permissoes: AcaoPermissao[];
  editavel: boolean; // ADMINISTRADOR, por seguranca, nao deve ser editavel
}

export interface Permissao {
  acao: AcaoPermissao;
  label: string;
  categoria:
    | 'Usuários'
    | 'Acervo'
    | 'Empréstimos'
    | 'Financeiro'
    | 'Relatórios'
    | 'Sistema';
}
