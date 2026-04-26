import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { EmprestimosService } from 'src/app/services/Emprestimos.service';
import { ClientesService } from 'src/app/services/Clientes.service';
import { LivrosService } from 'src/app/services/Livros.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmprestimoDB } from 'src/app/models/emprestimos.model';
import { Livro } from 'src/app/models/livros.model';

@Component({
  selector: 'app-emprestimos-usuarios',
  templateUrl: './emprestimos-usuarios.component.html',
  styleUrls: ['./emprestimos-usuarios.component.scss'],
})
export class EmprestimosUsuariosComponent implements OnInit {
  private emprestimosService = inject(EmprestimosService);
  private clientesService = inject(ClientesService);
  private livrosService = inject(LivrosService);
  private authService = inject(AuthService);
  private alert = inject(AlertService);

  emprestimos: EmprestimoDB[] = [];
  livrosDisponiveis: Livro[] = [];
  usuarios: any[] = [];
  loading = true;

  // Dialog — novo empréstimo (só bibliotecário)
  emprestimoDialog = false;
  submitted = false;
  novoEmprestimo: any = { usuario: null, livro: null };

  // ── Perfil ─────────────────────────────────────────────
  get isLeitor(): boolean {
    return this.authService.hasProfile(['LEITOR']);
  }

  get isBibliotecario(): boolean {
    return this.authService.hasProfile(['BIBLIOTECARIO']);
  }

  get sessao() {
    return this.authService.session;
  }

  get funcionarioLogadoId(): number {
    return this.sessao?.idFuncionario ?? 1;
  }

  /** Lista filtrada apenas com os empréstimos do usuário logado. */
  get meusEmprestimos(): EmprestimoDB[] {
    const idUser = this.sessao?.idUsuario;
    if (!idUser) return [];
    return this.emprestimos.filter((e) => e.idUser === idUser);
  }

  // ── Ciclo de vida ──────────────────────────────────────
  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;

    this.emprestimosService.FindAll().subscribe({
      next: (res) => {
        this.emprestimos = res;
        this.loading = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar empréstimos');
        this.loading = false;
      },
    });

    if (this.isBibliotecario) {
      this.clientesService.BuscarUsuarios().subscribe({
        next: (res) => (this.usuarios = res),
      });
      this.livrosService.FindAll().subscribe({
        next: (res) =>
          (this.livrosDisponiveis = res.filter((l) => (l.QtdLivros ?? 0) > 0)),
      });
    }
  }

  // ── Helpers de apresentação ───────────────────────────
  getStatusLabel(emp: EmprestimoDB): string {
    return emp.AutorizadoPor ? 'Em Andamento' : 'Ag. Retirada';
  }

  getStatusSeverity(emp: EmprestimoDB): 'success' | 'warning' {
    return emp.AutorizadoPor ? 'success' : 'warning';
  }

  formatarData(data: string | undefined): string {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  // ── Ações do bibliotecário ────────────────────────────
  abrirNovo(): void {
    this.novoEmprestimo = { usuario: null, livro: null };
    this.submitted = false;
    this.emprestimoDialog = true;
  }

  fecharDialog(): void {
    this.emprestimoDialog = false;
    this.submitted = false;
  }

  salvarEmprestimo(): void {
    this.submitted = true;
    if (!this.novoEmprestimo.usuario || !this.novoEmprestimo.livro) {
      this.alert.error('Campos obrigatórios', 'Selecione o usuário e o livro');
      return;
    }

    this.emprestimosService
      .Registrar({
        idLivro: this.novoEmprestimo.livro.idLivro,
        idUser: this.novoEmprestimo.usuario.idUsuario,
        AutorizadoPor: this.funcionarioLogadoId,
        VistoriadoPor: this.funcionarioLogadoId,
      })
      .subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Empréstimo registrado');
          this.emprestimoDialog = false;
          this.carregarDados();
        },
        error: (err) =>
          this.alert.error(
            'Erro',
            err?.error?.message || 'Falha ao registrar empréstimo',
          ),
      });
  }

  autorizarRetirada(emp: EmprestimoDB): void {
    this.emprestimosService
      .Autorizar({ idEmprestimo: emp.id, AutorizadoPor: this.funcionarioLogadoId })
      .subscribe({
        next: () => {
          this.alert.success('Autorizado', 'Retirada confirmada com sucesso');
          this.carregarDados();
        },
        error: () => this.alert.error('Erro', 'Falha ao autorizar retirada'),
      });
  }

  async devolverLivro(emp: EmprestimoDB): Promise<void> {
    const ok = await this.alert.confirm(
      'Confirmar Devolução',
      `Devolver "${emp.livro?.Titulo}"?`,
    );
    if (!ok) return;

    this.emprestimosService
      .ConfirmarDevolucao({
        idEmprestimo: emp.id,
        VistoriadoPor: this.funcionarioLogadoId,
        dataPrevisao: emp.created_at,
      })
      .subscribe({
        next: (res) => {
          if (res.multaAplicada > 0) {
            this.alert.toastWarning(
              `Multa de R$ ${res.multaAplicada.toFixed(2)} gerada por atraso`,
            );
          } else {
            this.alert.toastSuccess('Devolução confirmada');
          }
          this.carregarDados();
        },
        error: () => this.alert.error('Erro', 'Falha ao confirmar devolução'),
      });
  }

  renovarEmprestimo(_emp: EmprestimoDB): void {
    this.alert.info('Renovação', 'Recurso de renovação ainda não disponível');
  }
}
