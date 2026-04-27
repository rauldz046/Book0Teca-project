# Plano de Testes — Book0Teca

> Documento de referência para validação manual e exploratória do sistema (front Angular + mock back-end Express).
> Legenda de prioridade: 🔴 crítico (bloqueador) · 🟡 importante · 🟢 desejável
> Convenção de IDs: `TC-<MÓDULO>-<NN>`

---

## Índice
1. Autenticação & Sessão
2. Permissões / RBAC
3. Navbar & Navegação
4. Catálogo
5. Detalhe do Livro & Compra
6. Empréstimo
7. Gerenciamento de Funcionários
8. Gerenciamento de Leitores
9. Perfil do Usuário
10. Endereço & Banco (CRUD relacional)
11. Vendas / Financeiro
12. Multas
13. Solicitações
14. Atividade
15. Reservas
16. Não-funcionais (UX, responsividade, performance, acessibilidade)
17. Smoke Test (regressão rápida)
18. Dados de teste recomendados

---

## 1. Autenticação & Sessão

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-AUTH-01 | 🔴 | Login válido como LEITOR — redireciona para `/catalogo`, sessão persiste em `sessionStorage`/`AuthService`. |
| TC-AUTH-02 | 🔴 | Login válido como ADMIN — acessa rotas administrativas. |
| TC-AUTH-03 | 🔴 | Login com senha incorreta — exibe SweetAlert e mantém na tela. |
| TC-AUTH-04 | 🟡 | Login com `SenhaInicial=true` — força troca de senha antes de prosseguir. |
| TC-AUTH-05 | 🔴 | Logout limpa sessão e bloqueia rota protegida ao voltar. |
| TC-AUTH-06 | 🟡 | Recuperação de senha (se ativa) envia/atualiza nova senha provisória. |
| TC-AUTH-07 | 🟡 | Sessão restaura `endereco` e `banco` enriquecidos no payload de login. |

## 2. Permissões / RBAC

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-RBAC-01 | 🔴 | LEITOR não vê itens de menu de gestão (funcionários, financeiro, estoque). |
| TC-RBAC-02 | 🔴 | BIBLIOTECARIO acessa empréstimos e leitores, não acessa financeiro. |
| TC-RBAC-03 | 🔴 | FINANCEIRO acessa vendas/multas, não altera estoque. |
| TC-RBAC-04 | 🔴 | ESTOQUE acessa catálogo/estoque, não vê dados financeiros. |
| TC-RBAC-05 | 🔴 | ADMINISTRADOR vê todos os módulos. |
| TC-RBAC-06 | 🟡 | Acesso direto via URL a rota proibida → redireciona/erro. |

## 3. Navbar & Navegação

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-NAV-01 | 🔴 | Botão de colapsar fica visível em desktop e mobile. |
| TC-NAV-02 | 🟡 | Estado colapsado/expandido persiste ao navegar. |
| TC-NAV-03 | 🟡 | PanelMenu expande/colapsa categorias. |
| TC-NAV-04 | 🟢 | Badge de notificação aparece quando há solicitação pendente. |

## 4. Catálogo

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-CAT-01 | 🔴 | Lista de livros é renderizada com capas via Open Library Covers API. |
| TC-CAT-02 | 🟡 | Filtro por categoria/autor reduz lista corretamente. |
| TC-CAT-03 | 🟡 | Busca por título encontra livro com diacríticos/maiúsculas. |
| TC-CAT-04 | 🔴 | Clique em card abre `/detalhe-livro/:id` correto. |
| TC-CAT-05 | 🟢 | Paginação/scroll infinito (se ativo) carrega próxima página. |

## 5. Detalhe do Livro & Compra

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-COMP-01 | 🔴 | Step 1 mostra "Endereço de entrega" preenchido a partir de `sessionRaw.endereco`. |
| TC-COMP-02 | 🔴 | Quando não há endereço, exibe link "Cadastrar em /config/perfil". |
| TC-COMP-03 | 🔴 | Seleção de método de pagamento PIX revela linha PIX na nota fiscal usando `banco.CodigosPix`. |
| TC-COMP-04 | 🔴 | Concluir compra cria `Venda` no back-end com `enderecoEntrega` e `formaPagamento`. |
| TC-COMP-05 | 🟡 | Compra com cartão sem PIX não exibe linha PIX. |
| TC-COMP-06 | 🟡 | Quantidade ≤ 0 ou maior que estoque é bloqueada. |
| TC-COMP-07 | 🟢 | Voltar ao step anterior preserva os dados. |

## 6. Empréstimo

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-EMP-01 | 🔴 | Bibliotecário cria empréstimo selecionando leitor + livro. |
| TC-EMP-02 | 🔴 | Devolução marca status como devolvido e atualiza estoque. |
| TC-EMP-03 | 🟡 | Empréstimo atrasado gera multa automática (se aplicável). |
| TC-EMP-04 | 🟡 | Renovação estende prazo dentro do limite. |

## 7. Gerenciamento de Funcionários

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-FUNC-01 | 🔴 | Wizard 4 etapas (Pessoal · Endereço · Bancário · Acesso) navega via `step-tabs`. |
| TC-FUNC-02 | 🔴 | Salvar com Pessoal+Acesso preenchidos cria funcionário sem endereco/banco. |
| TC-FUNC-03 | 🔴 | Salvar com endereço completo cria linha em `infoEndereco` e linka via `InfoEndereco` FK. |
| TC-FUNC-04 | 🔴 | Salvar com banco completo cria linha em `infoBancario` e linka via `InfoBancario` FK. |
| TC-FUNC-05 | 🟡 | Salvar com endereço parcial NÃO cria linha (validação `isEnderecoPreenchido`). |
| TC-FUNC-06 | 🔴 | Editar funcionário pré-popula os 4 forms com dados enriquecidos. |
| TC-FUNC-07 | 🔴 | Editar e atualizar endereço modifica a linha existente, não cria nova. |
| TC-FUNC-08 | 🟡 | Form inválido bloqueia salvar e pula automaticamente para a primeira step com erro. |
| TC-FUNC-09 | 🟡 | Tabela mostra coluna Cidade/UF a partir de `endereco`. |
| TC-FUNC-10 | 🟡 | Alterar Status (Ativo/Inativo) reflete no campo `StatusAtividadeGeral_idStatus`. |
| TC-FUNC-11 | 🟢 | Filtros/busca por nome ou perfil funcionam. |

## 8. Gerenciamento de Leitores

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-LEIT-01 | 🔴 | Modal Mat Dialog abre com SweetAlert acima (z-index 2147483000). |
| TC-LEIT-02 | 🔴 | Wizard 4 steps idêntico ao de funcionários, com `p-float-label` e `.native-select`. |
| TC-LEIT-03 | 🔴 | Criar leitor com endereço+banco cria 3 linhas relacionadas. |
| TC-LEIT-04 | 🔴 | Editar leitor atualiza ou cria endereço/banco conforme existência. |
| TC-LEIT-05 | 🟡 | Tabela de leitores mostra Cidade/UF (com fallback "—"). |
| TC-LEIT-06 | 🟡 | Excluir leitor remove e atualiza lista. |

## 9. Perfil do Usuário

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-PERF-01 | 🔴 | Sidebar mostra abas Pessoal · Endereço · Banco · Preferências. |
| TC-PERF-02 | 🔴 | Aba Endereço pré-popula `enderecoForm` a partir de `sessionRaw.endereco`. |
| TC-PERF-03 | 🔴 | Salvar endereço chama `UpdateUsuario`/`UpdateFuncionario` com payload aninhado. |
| TC-PERF-04 | 🔴 | Aba Banco pré-popula `bancoForm` a partir de `sessionRaw.banco`. |
| TC-PERF-05 | 🔴 | Salvar banco persiste e atualiza sessão. |
| TC-PERF-06 | 🟡 | Trocar senha exige senha atual e confirma nova. |
| TC-PERF-07 | 🟢 | Upload de foto de perfil atualiza `fotoperfil`. |

## 10. Endereço & Banco (CRUD relacional)

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-EB-01 | 🔴 | `GET /enderecos/findAll` retorna lista. |
| TC-EB-02 | 🔴 | `POST /enderecos/create` cria e retorna `idInfoEnd`. |
| TC-EB-03 | 🔴 | `POST /enderecos/update` atualiza por id. |
| TC-EB-04 | 🔴 | `POST /bancos/create` e `update` simétricos. |
| TC-EB-05 | 🟡 | Helpers `isEnderecoPreenchido`/`isBancoPreenchido` evitam linhas vazias. |
| TC-EB-06 | 🟡 | CEP inválido (não 8 dígitos) é rejeitado pela validação do form. |

## 11. Vendas / Financeiro

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-VEN-01 | 🔴 | Listagem de vendas mostra valor total, comprador, status. |
| TC-VEN-02 | 🔴 | `enrichVenda` inclui `enderecoEntrega` e `formaPagamento`. |
| TC-VEN-03 | 🟡 | Filtro por período retorna vendas corretas. |
| TC-VEN-04 | 🟡 | Exportar relatório (se houver) gera CSV/PDF. |

## 12. Multas

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-MUL-01 | 🔴 | Multas pendentes aparecem nas estatísticas do perfil. |
| TC-MUL-02 | 🟡 | Pagar multa zera valor e marca como quitada. |
| TC-MUL-03 | 🟢 | Histórico de multas pagas é consultável. |

## 13. Solicitações

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-SOL-01 | 🟡 | Leitor cria solicitação de novo livro. |
| TC-SOL-02 | 🟡 | Bibliotecário aprova/rejeita e leitor recebe feedback. |

## 14. Atividade

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-ATV-01 | 🟢 | Linha do tempo lista ações recentes do usuário. |
| TC-ATV-02 | 🟢 | Filtro por tipo de evento funciona. |

## 15. Reservas

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-RES-01 | 🟡 | Reservar livro indisponível adiciona à fila. |
| TC-RES-02 | 🟡 | Quando devolvido, próximo da fila é notificado. |

## 16. Não-funcionais

| ID | Prioridade | Caso |
|----|-----------|------|
| TC-NF-01 | 🟡 | Layout responsivo em 360px, 768px, 1280px, 1920px. |
| TC-NF-02 | 🟡 | Overlays (SweetAlert, p-dialog, MatDialog) empilham na ordem correta. |
| TC-NF-03 | 🟢 | Tempo de resposta das listas < 1s com até 200 registros. |
| TC-NF-04 | 🟢 | Acessibilidade básica: foco visível, labels associadas, contraste. |
| TC-NF-05 | 🟡 | Recarregar a página mantém usuário autenticado. |
| TC-NF-06 | 🟢 | Mensagens de erro de API são mostradas em SweetAlert amigável. |

## 17. Smoke Test (executar a cada release)

1. 🔴 Login ADMIN
2. 🔴 Navegar Catálogo → Detalhe → comprar livro com endereço e PIX
3. 🔴 Criar funcionário com endereço+banco completos
4. 🔴 Criar leitor com endereço+banco completos
5. 🔴 Editar perfil próprio (endereço e banco)
6. 🔴 Logout e login como leitor recém-criado
7. 🔴 Conferir nota fiscal mostrando endereço e PIX

---

## 18. Dados de teste recomendados

**Usuários**
- `admin@book0teca.com` / senha forte — perfil ADMINISTRADOR
- `bibliotecario@book0teca.com` — BIBLIOTECARIO
- `financeiro@book0teca.com` — FINANCEIRO
- `estoque@book0teca.com` — ESTOQUE
- `leitor@book0teca.com` — LEITOR (com endereço e banco preenchidos)
- `leitor.semdados@book0teca.com` — LEITOR sem endereço/banco (para testar fallbacks)

**Endereço de teste**
```
Logradouro: Rua das Flores
Número: 123
Bairro: Centro
Cidade: São Paulo  · UF: SP
CEP: 01000-000
Nacionalidade: Brasileira
Complemento: Apto 12
```

**Banco de teste**
```
NomeBanco: Banco do Brasil
CodigoBanco: 001
TipoConta: Corrente
Agência: 1234-5
Conta: 67890-1
PIX: leitor@book0teca.com
```

**Livros**: ao menos 5 com capa válida na Open Library, 1 sem capa para testar fallback, 1 sem estoque para testar bloqueio de compra.

---

### Como reportar falhas
- Inclua **ID do caso de teste** (ex.: TC-COMP-03), passos para reproduzir, comportamento esperado vs. observado, screenshot/console.
- Falhas 🔴 bloqueiam release; 🟡 entram no backlog da próxima sprint; 🟢 são melhorias.
