import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emprestimo } from 'src/app/models/emprestimos';

type StatusFiltro = 'TODOS' | 'ATIVO' | 'ATRASADO' | 'DEVOLVIDO';

@Component({
  selector: 'app-emprestimos-ativos',
  templateUrl: './emprestimos-ativos.component.html',
  styleUrls: ['./emprestimos-ativos.component.scss'],
})
export class EmprestimosAtivosComponent implements OnInit {
  emprestimos: Emprestimo[] = [];
  emprestimosFiltrados: Emprestimo[] = [];

  filtroStatus: StatusFiltro = 'TODOS';
  filtroTexto = '';
  loading = false;
  displayNovoEmprestimo = false;

  readonly LIMITE_RENOVACOES = 3;
  readonly PRAZO_RENOVACAO_DIAS = 7;

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.carregarEmprestimos();
  }

  carregarEmprestimos() {
    this.emprestimos = [
      {
        id: 1,
        leitor: 'Ricardo Mendes',
        matricula: '2023001',
        livroTitulo: 'Arquitetura Limpa',
        dataEmprestimo: new Date(2023, 9, 20),
        dataPrevisaoDevolucao: new Date(2023, 10, 5),
        renovacoes: 0,
        status: 'ATRASADO',
      },
      {
        id: 2,
        leitor: 'Juliana Paes',
        matricula: '2023042',
        livroTitulo: 'Sapiens',
        dataEmprestimo: new Date(2023, 10, 1),
        dataPrevisaoDevolucao: new Date(2023, 10, 15),
        renovacoes: 1,
        status: 'ATIVO',
      },
      {
        id: 3,
        leitor: 'Marcos Silva',
        matricula: '2023015',
        livroTitulo: 'O Alquimista',
        dataEmprestimo: new Date(2023, 9, 10),
        dataPrevisaoDevolucao: new Date(2023, 9, 24),
        renovacoes: 2,
        status: 'DEVOLVIDO',
      },
    ];
    this.aplicarFiltros();
  }

  // ─── filtros ───────────────────────────────────────────────────────
  aplicarFiltros() {
    const txt = this.filtroTexto.trim().toLowerCase();
    this.emprestimosFiltrados = this.emprestimos.filter((e) => {
      const bateStatus = this.filtroStatus === 'TODOS' || e.status === this.filtroStatus;
      const bateTexto =
        !txt ||
        e.leitor.toLowerCase().includes(txt) ||
        e.matricula.toLowerCase().includes(txt) ||
        e.livroTitulo.toLowerCase().includes(txt);
      return bateStatus && bateTexto;
    });
  }

  limparFiltros() {
    this.filtroTexto = '';
    this.filtroStatus = 'TODOS';
    this.aplicarFiltros();
  }

  // ─── KPIs dinâmicos ────────────────────────────────────────────────
  get kpiAtivos(): number {
    return this.emprestimos.filter((e) => e.status === 'ATIVO').length;
  }

  get kpiAtrasados(): number {
    return this.emprestimos.filter((e) => e.status === 'ATRASADO').length;
  }

  get kpiDevolvidos(): number {
    return this.emprestimos.filter((e) => e.status === 'DEVOLVIDO').length;
  }

  // ─── helpers ───────────────────────────────────────────────────────
  getSeverity(status: string): 'success' | 'info' | 'danger' | 'warning' {
    switch (status) {
      case 'ATIVO':     return 'info';
      case 'ATRASADO':  return 'danger';
      case 'DEVOLVIDO': return 'success';
      default:          return 'warning';
    }
  }

  /** Dias restantes para devolução (negativo = atraso). */
  getDiasRestantes(emp: Emprestimo): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prazo = new Date(emp.dataPrevisaoDevolucao);
    prazo.setHours(0, 0, 0, 0);
    return Math.round((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }

  getPrazoLabel(emp: Emprestimo): string {
    if (emp.status === 'DEVOLVIDO') return 'Finalizado';
    const dias = this.getDiasRestantes(emp);
    if (dias < 0)  return `${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'} atrasado`;
    if (dias === 0) return 'Vence hoje';
    return `${dias} ${dias === 1 ? 'dia restante' : 'dias restantes'}`;
  }

  // ─── ações ─────────────────────────────────────────────────────────
  confirmarDevolucao(event: Event, emp: Emprestimo) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Confirmar a devolução de "${emp.livroTitulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, devolver',
      rejectLabel: 'Cancelar',
      accept: () => {
        emp.status = 'DEVOLVIDO';
        this.aplicarFiltros();
        this.messageService.add({
          severity: 'success',
          summary: 'Devolvido',
          detail: `"${emp.livroTitulo}" retornou ao estoque.`,
        });
      },
    });
  }

  renovar(emp: Emprestimo) {
    if (emp.renovacoes >= this.LIMITE_RENOVACOES) {
      this.messageService.add({
        severity: 'error',
        summary: 'Limite atingido',
        detail: `Este empréstimo já atingiu o máximo de ${this.LIMITE_RENOVACOES} renovações.`,
      });
      return;
    }

    emp.renovacoes++;
    emp.dataPrevisaoDevolucao = new Date(
      emp.dataPrevisaoDevolucao.getTime() + this.PRAZO_RENOVACAO_DIAS * 24 * 60 * 60 * 1000,
    );

    if (emp.status === 'ATRASADO' && this.getDiasRestantes(emp) >= 0) {
      emp.status = 'ATIVO';
    }

    this.aplicarFiltros();

    this.messageService.add({
      severity: 'info',
      summary: 'Renovado',
      detail: `Prazo estendido por mais ${this.PRAZO_RENOVACAO_DIAS} dias.`,
    });
  }
}
