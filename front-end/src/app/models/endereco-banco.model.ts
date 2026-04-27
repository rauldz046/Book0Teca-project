export interface InfoEndereco {
  idInfoEnd?: number;
  Logradouro: string;
  Bairro: string;
  Numero: number | null;
  Cidade: string;
  Estado: string;
  Nacionalidade: string;
  CEP: string;
  Complemento?: string;
}

export interface InfoBancario {
  IdInfoBancario?: number;
  NomeBanco: string;
  CodigoBanco: number | null;
  TipoConta: 'Corrente' | 'Poupança' | string;
  NumeroAgencia: number | null;
  DigitoAgencia: number | null;
  NumeroConta: number | null;
  DigitoConta: number | null;
  CodigosPix?: string;
}
