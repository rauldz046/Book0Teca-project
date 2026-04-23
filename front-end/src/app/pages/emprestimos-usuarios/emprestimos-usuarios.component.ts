import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { EmprestimosService } from 'src/app/services/Emprestimos.service';
import { ClientesService } from 'src/app/services/Clientes.service';
import { LivrosService } from 'src/app/services/Livros.service';
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
  private alert = inject(AlertService);

  // Dados do back-end
  emprestimos: EmprestimoDB[] = [];
  livrosDisponiveis: Livro[] = [];
  usuarios: any[] = [];

  // Controle do dialog
  emprestimoDialog = false;
  submitted = false;
  loading = true;

  novoEmprestimo: any = {
    usuario: null,
    livro: null,
    dataPrevisaoDevolucao: null,
  };

  // ID do funcionário logado — virá do localStorage/AuthService
  get funcionarioLogadoId(): number {
    const sessao = JSON.parse(localStorage.getItem('infoSessao') || '{}');
    return sessao?.idFuncionario || 1;
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;

    // Carrega empréstimos ativos
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

    // Carrega listas para o dropdown do modal
    this.clientesService.BuscarUsuarios().subscribe({
      next: (res) => (this.usuarios = res),
    });

    this.livrosService.FindAll().subscribe({
      next: (res) =>
        (this.livrosDisponiveis = res.filter((l) => l.QtdLivros > 0)),
    });
  }

  abrirNovo(): void {
    this.novoEmprestimo = {
      usuario: null,
      livro: null,
      dataPrevisaoDevolucao: null,
    };
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
      this.alert.error('Erro', 'Selecione o usuário e o livro');
      return;
    }

    const payload = {
      idLivro: this.novoEmprestimo.livro.idLivro,
      idUser: this.novoEmprestimo.usuario.idUsuario,
      AutorizadoPor: this.funcionarioLogadoId,
      VistoriadoPor: this.funcionarioLogadoId,
    };

    this.emprestimosService.Registrar(payload).subscribe({
      next: () => {
        this.alert.success('Sucesso', 'Empréstimo registrado');
        this.emprestimoDialog = false;
        this.carregarDados(); // Recarrega a lista
      },
      error: (err) => {
        const msg = err?.error?.message || 'Falha ao registrar empréstimo';
        this.alert.error('Erro', msg);
      },
    });
  }

  async devolverLivro(emp: EmprestimoDB): Promise<void> {
    const ok = await this.alert.confirm(
      'Confirmar Devolução',
      `Devolver "${emp.livro?.Titulo}"?`,
    );
    if (!ok) return;

    const payload = {
      idEmprestimo: emp.id,
      VistoriadoPor: this.funcionarioLogadoId,
      dataPrevisao: emp.created_at, // Ajuste quando campo de prazo for adicionado ao banco
    };

    this.emprestimosService.ConfirmarDevolucao(payload).subscribe({
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

  getSeverity(livro: Livro | undefined): 'success' | 'danger' | 'warning' {
    if (!livro || !livro.QtdLivros || livro.QtdLivros <= 0) return 'danger';
    return 'success';
  }

  // Formata data ISO para dd/MM/yyyy
  formatarData(data: string | undefined): string {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  renovarEmprestimo(emp: EmprestimoDB): void {
    this.alert.info('Renovação', 'Recurso de renovação ainda não implementado');
  }
}
