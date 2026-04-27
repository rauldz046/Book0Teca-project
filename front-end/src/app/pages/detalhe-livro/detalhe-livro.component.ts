import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LivrosService } from 'src/app/services/Livros.service';
import { VendasService } from 'src/app/services/Vendas.service';
import { EmprestimosService } from 'src/app/services/Emprestimos.service';
import { AuthService } from 'src/app/services/auth.service';
import { Livro } from 'src/app/models/livros.model';

@Component({
  selector: 'app-detalhe-livro',
  templateUrl: './detalhe-livro.component.html',
  styleUrls: ['./detalhe-livro.component.scss'],
})
export class DetalheLivroComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private livrosService = inject(LivrosService);
  private vendasService = inject(VendasService);
  private emprestimosService = inject(EmprestimosService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  livro: Livro | null = null;
  loading = true;
  hoje = new Date();

  // ── Compra ──────────────────────────────────────────────
  dialogCompra = false;
  activeStep = 0;
  stepsCompra = [
    { label: 'Resumo' },
    { label: 'Seus Dados' },
    { label: 'Pagamento' },
    { label: 'Confirmação' },
  ];
  metodosPagamento = [
    { label: 'PIX',           value: 'PIX',          icon: 'pi pi-qrcode' },
    { label: 'Boleto',        value: 'BOLETO',        icon: 'pi pi-file-pdf' },
    { label: 'Cartão',        value: 'CARTÃO',        icon: 'pi pi-credit-card' },
    { label: 'Dinheiro',      value: 'DINHEIRO',      icon: 'pi pi-money-bill' },
    { label: 'Transferência', value: 'TRANSFERÊNCIA', icon: 'pi pi-send' },
  ];
  metodoPagamentoSelecionado = '';
  loadingCompra = false;
  vendaConfirmada: any = null;

  // TC-COMP-06: quantidade selecionada na compra (default 1).
  // O template prende min=1 e max=QtdLivros (físico) via p-inputNumber.
  quantidade: number = 1;

  // ── Empréstimo ───────────────────────────────────────────
  dialogEmprestimo = false;
  livroDisponivel = false;
  loadingEmprestimo = false;

  readonly CAPA_PLACEHOLDER =
    'https://via.placeholder.com/300x420/e2e8f0/64748b?text=Sem+Capa';

  get dadosUsuario() {
    return this.authService.session;
  }

  get isLeitor(): boolean {
    return this.authService.hasProfile(['LEITOR']);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/acervo/livros']);
      return;
    }
    this.livrosService.FindById(id).subscribe({
      next: (livro) => {
        this.livro = livro;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Livro não encontrado.',
        });
        this.router.navigate(['/acervo/livros']);
      },
    });
  }

  getCapa(): string {
    return this.livro?.Capa || this.livro?.capa || this.CAPA_PLACEHOLDER;
  }

  getStatusLabel(): string {
    if (!this.livro) return '';
    if (!this.livro.LivroDigital && (this.livro.QtdLivros ?? 0) <= 0)
      return 'Indisponível';
    if (this.livro.LivroFisico && (this.livro.QtdLivros ?? 0) <= 2)
      return 'Últimas unidades';
    return 'Disponível';
  }

  getSeverity(): 'success' | 'warning' | 'danger' {
    if (!this.livro) return 'danger';
    if (!this.livro.LivroDigital && (this.livro.QtdLivros ?? 0) <= 0)
      return 'danger';
    if (this.livro.LivroFisico && (this.livro.QtdLivros ?? 0) <= 2)
      return 'warning';
    return 'success';
  }

  podeComprar(): boolean {
    if (!this.livro) return false;
    if (this.livro.LivroDigital) return true;
    return (this.livro.QtdLivros ?? 0) > 0;
  }

  onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) img.src = this.CAPA_PLACEHOLDER;
  }

  voltar(): void {
    this.router.navigate(['/acervo/livros']);
  }

  // ── Fluxo de compra ──────────────────────────────────────
  abrirDialogCompra(): void {
    this.activeStep = 0;
    this.metodoPagamentoSelecionado = '';
    this.vendaConfirmada = null;
    this.quantidade = 1;
    this.hoje = new Date();
    this.dialogCompra = true;
  }

  nextStep(): void { this.activeStep++; }
  prevStep(): void { this.activeStep--; }

  /**
   * TC-COMP-06: validação client-side de quantidade.
   * Retorna mensagem de erro ou null se válida.
   */
  private validarQuantidade(): string | null {
    if (!this.livro) return 'Livro não carregado';
    if (!Number.isInteger(this.quantidade) || this.quantidade < 1) {
      return 'A quantidade deve ser pelo menos 1';
    }
    if (this.livro.LivroFisico) {
      const estoque = this.livro.QtdLivros ?? 0;
      if (this.quantidade > estoque) {
        return `Quantidade (${this.quantidade}) excede o estoque (${estoque})`;
      }
    }
    return null;
  }

  /** TC-COMP-04 / TC-COMP-06: total a pagar no template (preço × quantidade). */
  get totalCompra(): number {
    return (this.livro?.PrecoVenda ?? 0) * (this.quantidade || 0);
  }

  confirmarCompra(): void {
    if (!this.livro || !this.dadosUsuario) return;

    // TC-COMP-06: bloqueia antes de chamar API
    const erroQtd = this.validarQuantidade();
    if (erroQtd) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Quantidade inválida',
        detail: erroQtd,
      });
      return;
    }

    this.loadingCompra = true;

    // TC-COMP-04: enviar enderecoEntrega + formaPagamento + Quantidade.
    // O backend persiste o endereço como snapshot (JSON) — preserva histórico.
    this.vendasService.Registrar({
      idLivro: this.livro.idLivro,
      idUsuario: this.dadosUsuario.idUsuario,
      ValorPago: this.totalCompra,
      enderecoEntrega: this.dadosUsuario.endereco || null,
      formaPagamento: this.metodoPagamentoSelecionado,
      Quantidade: this.quantidade,
    }).subscribe({
      next: (res) => {
        this.vendaConfirmada = res.venda;
        this.vendasService.ConfirmarPagamento({
          idVenda: res.venda.id,
          ValorPago: this.totalCompra,
        }).subscribe({
          next: () => {
            this.loadingCompra = false;
            this.activeStep = 3;
          },
          error: () => {
            this.loadingCompra = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao confirmar o pagamento.',
            });
          },
        });
      },
      error: (err) => {
        this.loadingCompra = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na compra',
          detail: err?.error?.message || 'Não foi possível registrar a compra.',
        });
      },
    });
  }

  imprimirNota(): void {
    window.print();
  }

  fecharEVoltar(): void {
    this.dialogCompra = false;
    this.router.navigate(['/acervo/livros']);
  }

  // ── Fluxo de empréstimo ──────────────────────────────────
  abrirDialogEmprestimo(): void {
    this.livroDisponivel = (this.livro?.QtdLivros ?? 0) > 0;
    this.dialogEmprestimo = true;
  }

  confirmarSolicitacaoEmprestimo(): void {
    if (!this.livro || !this.dadosUsuario) return;
    this.loadingEmprestimo = true;

    this.emprestimosService.Solicitar({
      idLivro: this.livro.idLivro,
      idUser: this.dadosUsuario.idUsuario,
    }).subscribe({
      next: () => {
        this.loadingEmprestimo = false;
        this.dialogEmprestimo = false;
        if (this.livro) this.livro.QtdLivros = (this.livro.QtdLivros ?? 1) - 1;
        this.messageService.add({
          severity: 'success',
          summary: 'Pedido Registrado!',
          detail: 'Seu pedido de retirada foi enviado. Retire o livro na biblioteca.',
          life: 6000,
        });
      },
      error: (err) => {
        this.loadingEmprestimo = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.message || 'Falha ao registrar a solicitação.',
        });
      },
    });
  }

  entrarFilaEspera(): void {
    this.loadingEmprestimo = true;
    setTimeout(() => {
      this.loadingEmprestimo = false;
      this.dialogEmprestimo = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Lista de Espera',
        detail:
          'Você foi adicionado à lista de espera. Será notificado quando o livro estiver disponível.',
        life: 7000,
      });
    }, 600);
  }
}
