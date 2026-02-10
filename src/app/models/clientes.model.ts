export interface Usuarios {
  id: number;
  cpfCnpj: string;
  nome: string;
  tipo: 'Cliente' | 'Fornecedor';
  ativo: boolean;
}
