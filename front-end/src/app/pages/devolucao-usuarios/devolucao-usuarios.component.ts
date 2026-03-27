import { Component, inject, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EmprestimoAtivo } from '../../models/emprestimos';

@Component({
  selector: 'app-devolucao-usuarios',
  templateUrl: './devolucao-usuarios.component.html',
  styleUrls: ['./devolucao-usuarios.component.scss'],
})
export class DevolucaoUsuariosComponent {
  emprestimosAtivos: EmprestimoAtivo[] = [];
  devolucaoDialog: boolean = false;
  devolucaoSelecionada: any = {};
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Configurações de Negócio
  VALOR_DIARIA_MULTA = 2.5;
  opcoesSituacao = [
    { label: 'Excelente', value: 'Excelente' },
    { label: 'Bom', value: 'Bom' },
    { label: 'Avariado (Multa extra)', value: 'Avariado' },
    { label: 'Perdido (Reposição)', value: 'Perdido' },
  ];

  ngOnInit() {
    this.carregarEmprestimosPendentes();
  }

  carregarEmprestimosPendentes() {
    // Simulação de dados vindo da API (Apenas os que não foram devolvidos)
    const hoje = new Date();
    this.emprestimosAtivos = [
      {
        id: 101,
        livroTitulo: 'Clean Code',
        usuarioNome: 'Ricardo Lima',
        dataEmprestimo: new Date(2023, 9, 1),
        dataPrevisaoDevolucao: new Date(2023, 9, 8),
        diasAtraso: 0,
        multaCalculada: 0,
      },
      {
        id: 102,
        livroTitulo: 'Dom Casmurro',
        usuarioNome: 'Ana Paula',
        dataEmprestimo: new Date(2023, 8, 20),
        dataPrevisaoDevolucao: new Date(2023, 8, 27),
        diasAtraso: 0,
        multaCalculada: 0,
      },
    ];

    this.emprestimosAtivos.forEach((emp) => this.calcularAtraso(emp));
  }

  calcularAtraso(emp: EmprestimoAtivo) {
    const hoje = new Date();
    if (hoje > emp.dataPrevisaoDevolucao) {
      const diffTime = Math.abs(
        hoje.getTime() - emp.dataPrevisaoDevolucao.getTime(),
      );
      emp.diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      emp.multaCalculada = emp.diasAtraso * this.VALOR_DIARIA_MULTA;
    }
  }

  abrirCheckin(emprestimo: EmprestimoAtivo) {
    this.devolucaoSelecionada = { ...emprestimo, situacaoLivro: 'Bom' };
    this.devolucaoDialog = true;
  }

  confirmarRecebimento() {
    // Aqui você chamaria seu service.processarDevolucao(this.devolucaoSelecionada)

    this.messageService.add({
      severity: 'success',
      summary: 'Devolução Confirmada',
      detail: `O livro ${this.devolucaoSelecionada.livroTitulo} foi retornado ao estoque.`,
      life: 5000,
    });

    this.emprestimosAtivos = this.emprestimosAtivos.filter(
      (val) => val.id !== this.devolucaoSelecionada.id,
    );
    this.devolucaoDialog = false;
  }
}
