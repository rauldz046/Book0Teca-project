import { InfoBancario, InfoEndereco } from './endereco-banco.model';

export interface FuncionariosLogados {
  id: number;
  idFuncionario?: number;
  MatriculaFunc: string;
  NomeFunc: string;
  CPFFunc: string;
  EmailFunc: string;
  RegiaoFunc: string;
  SenhaFunc?: string;
  SenhaInicialFunc?: boolean;
  idPerfilFuncionarios: string;
  CadastradoPor?: string;
  Status: number;
  StatusAtividadeGeral_idStatus?: number;
  InfoBancario_IdInfoBancario?: number;
  InfoEndereco_idInfoEnd?: number;
  endereco?: InfoEndereco | null;
  banco?: InfoBancario | null;
  created_date?: Date;
  update_date?: Date;
  deleted_date?: Date;
}
