export interface UsuariosLogados {
  idUsuario: number;
  Nome: string;
  Email: string;
  CPF: string;
  Telefone: string;
  Senha: string;
  SenhaInicial: boolean;
  Status: number;
  fotoperfil?: string;
  InfoEndereco: number;
  InfoBancario: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  role: 'LEITOR' | 'BIBLIOTECARIO' | 'FINANCEIRO' | 'ESTOQUE' | 'ADMINISTRADOR';
  avatar: string;
  membroDesde: string;
  preferencias: {
    notificacoesEmail: boolean;
    notificacoesWpp: boolean;
    temaEscuro: boolean;
    idioma: string;
  };
  estatisticas: {
    livrosEmprestados: number;
    comprasRealizadas: number;
    multasPendentes: number;
  };
}
