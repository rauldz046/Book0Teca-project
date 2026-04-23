export interface TipoSolicitacao {
  id: number;
  Descricao: string;
}

export interface EtapaSolicitacao {
  id: number;
  Descricao: string;
  Ordem: number;
  Final: 0 | 1;
}

export interface Solicitacao {
  Id: number;
  Descricao: string;
  CriadaPor: number;
  FormularioId?: number;
  TiposSolicitacao: number;
  Etapas: number;
  created_at?: string;
  updated_at?: string;
  // Joins
  formulario?: { id: number; FormularioJSON: any };
  tipo?: { Descricao: string };
  etapa?: EtapaSolicitacao;
}

export interface CriarSolicitacaoPayload {
  Descricao: string;
  CriadaPor: number;
  TiposSolicitacaoId: number;
  FormularioId?: number;
}
