import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emprestimo } from 'src/app/models/emprestimos';

@Component({
  selector: 'app-emprestimos-ativos',
  templateUrl: './emprestimos-ativos.component.html',
  styleUrls: ['./emprestimos-ativos.component.scss'],
})
export class EmprestimosAtivosComponent {
  emprestimos: Emprestimo[] = [];
  filtroStatus: string = 'TODOS';
  loading: boolean = false;
  displayNovoEmprestimo: boolean = false;

  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);

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
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ATIVO':
        return 'info';
      case 'ATRASADO':
        return 'danger';
      case 'DEVOLVIDO':
        return 'success';
      case 'RESERVADO':
        return 'warning';
      default:
        return 'info';
    }
  }

  confirmarDevolucao(event: Event, emp: Emprestimo) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Confirmar a devolução do livroTitulo "${emp.livroTitulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, Devolver',
      rejectLabel: 'Cancelar',
      accept: () => {
        emp.status = 'DEVOLVIDO';
        this.messageService.add({
          severity: 'success',
          summary: 'Devolvido',
          detail: 'livroTitulo retornado ao estoque.',
        });
      },
    });
  }

  renovar(emp: Emprestimo) {
    if (emp.renovacoes >= 3) {
      this.messageService.add({
        severity: 'error',
        summary: 'Limite Atingido',
        detail: 'Este empréstimo já atingiu o máximo de renovações.',
      });
      return;
    }
    emp.renovacoes++;
    // Adiciona 7 dias à data prevista
    emp.dataPrevisaoDevolucao = new Date(
      emp.dataPrevisaoDevolucao.getTime() + 7 * 24 * 60 * 60 * 1000,
    );
    this.messageService.add({
      severity: 'info',
      summary: 'Renovado',
      detail: 'Prazo estendido por mais 7 dias.',
    });
  }
}
