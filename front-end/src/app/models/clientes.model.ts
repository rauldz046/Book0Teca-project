export interface UsuariosLogados {
  idUsuario: number;
  Nome: string;
  Email: string;
  CPF: string;
  Telefone: string;
  Senha: string;
  SenhaInicial: boolean;
  Status: string;
  InfoEndereco: number;
  InfoBancario: number;
  created_at: Date;
  updated_at: Date;
}
