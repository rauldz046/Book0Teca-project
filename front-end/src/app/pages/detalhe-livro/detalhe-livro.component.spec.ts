/**
 * Spec lógico de TC-COMP-06 (validação de quantidade na compra).
 *
 * Não usa TestBed: replica a lógica pura de validarQuantidade() para testar
 * sem dependências de Angular/DOM. Em CI Karma+Chrome, este spec roda com
 * o restante; localmente sem Chrome, dá pra rodar com `ts-node` se quiser.
 *
 * Para testes integrados do componente (com TestBed), seria preciso mockar
 * VendasService, EmprestimosService, AuthService, MessageService e Router.
 * Fica como pendência se for necessário.
 */

interface LivroMin {
  LivroFisico: boolean;
  LivroDigital?: boolean;
  QtdLivros?: number;
}

/** Cópia da lógica do componente para teste isolado. */
function validarQuantidade(livro: LivroMin | null, quantidade: number): string | null {
  if (!livro) return 'Livro não carregado';
  if (!Number.isInteger(quantidade) || quantidade < 1) {
    return 'A quantidade deve ser pelo menos 1';
  }
  if (livro.LivroFisico) {
    const estoque = livro.QtdLivros ?? 0;
    if (quantidade > estoque) {
      return `Quantidade (${quantidade}) excede o estoque (${estoque})`;
    }
  }
  return null;
}

describe('TC-COMP-06 — validarQuantidade', () => {
  const livroFisico: LivroMin = { LivroFisico: true, QtdLivros: 5 };
  const livroDigital: LivroMin = { LivroFisico: false, LivroDigital: true };

  it('quantidade 1 em estoque suficiente é válida', () => {
    expect(validarQuantidade(livroFisico, 1)).toBeNull();
  });

  it('quantidade igual ao estoque é válida (limite)', () => {
    expect(validarQuantidade(livroFisico, 5)).toBeNull();
  });

  it('quantidade 0 é bloqueada', () => {
    expect(validarQuantidade(livroFisico, 0)).toBe('A quantidade deve ser pelo menos 1');
  });

  it('quantidade negativa é bloqueada', () => {
    expect(validarQuantidade(livroFisico, -3)).toBe('A quantidade deve ser pelo menos 1');
  });

  it('quantidade maior que estoque é bloqueada', () => {
    expect(validarQuantidade(livroFisico, 6)).toBe(
      'Quantidade (6) excede o estoque (5)'
    );
  });

  it('quantidade não inteira é bloqueada', () => {
    expect(validarQuantidade(livroFisico, 1.5)).toBe(
      'A quantidade deve ser pelo menos 1'
    );
  });

  it('livro digital não checa estoque (qualquer qtd >= 1 é válida)', () => {
    expect(validarQuantidade(livroDigital, 99)).toBeNull();
  });

  it('estoque undefined em livro físico é tratado como 0', () => {
    const semEstoque: LivroMin = { LivroFisico: true };
    expect(validarQuantidade(semEstoque, 1)).toBe(
      'Quantidade (1) excede o estoque (0)'
    );
  });

  it('livro nulo retorna mensagem específica', () => {
    expect(validarQuantidade(null, 1)).toBe('Livro não carregado');
  });
});
