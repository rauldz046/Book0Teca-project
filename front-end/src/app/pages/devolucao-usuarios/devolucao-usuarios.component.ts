import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { EmprestimosService } from 'src/app/services/Emprestimos.service';
import { EmprestimoDB } from 'src/app/models/emprestimos.model';

@Component({
  selector: 'app-devolucao-usuarios',
  templateUrl: './devolucao-usuarios.component.html',
  styleUrls: ['./devolucao-usuarios.component.scss'],
})
export class DevolucaoUsuariosComponent implements OnInit {
  private emprestimosService = inject(EmprestimosService);
  private messageService     = inject(MessageService);
  private alert              = inject(AlertService);

  emprestimosAtivos: EmprestimoDB[] = [];
  devolucaoDialog    = false;
  devolucaoSelecionada: any = {};
  loading = true;

  VALOR_DIARIA_MULTA = 2.5;

  opcoesSituacao = [
    { label: 'Excelente',              value: 'Excelente' },
    { label: 'Bom',                    value: 'Bom' },
    { label: 'Avariado (Multa extra)', value: 'Avariado' },
    { label: 'Perdido (Reposição)',    value: 'Perdido' },
  ];

  get funcionarioLogadoId(): number {
    const sessao = JSON.parse(localStorage.getItem('infoSessao') || '{}');
    return sessao?.idFuncionario || 1;
  }

  ngOnInit(): void {
    this.carregarEmprestimosPendentes();
  }

  carregarEmprestimosPendentes(): void {
    this.loading = true;
    this.emprestimosService.FindAll().subscribe({
      next: (res) => {
        this.emprestimosAtivos = res;
        this.loading = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar empréstimos');
        this.loading = false;
      },
    });
  }

  // Calcula atraso baseado na data de criação + 7 dias de prazo padrão
  // TODO: adicionar campo DataPrevisaoDevolucao no banco
  calcularDiasAtraso(emp: EmprestimoDB): number {
    const prazo = new Date(emp.created_at);
    prazo.setDate(prazo.getDate() + 7);
    const hoje = new Date();
    if (hoje <= prazo) return 0;
    const diff = hoje.getTime() - prazo.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  calcularMulta(emp: EmprestimoDB): number {
    return this.calcularDiasAtraso(emp) * this.VALOR_DIARIA_MULTA;
  }

  abrirCheckin(emprestimo: EmprestimoDB): void {
    this.devolucaoSelecionada = {
      ...emprestimo,
      situacaoLivro: 'Bom',
      diasAtraso:    this.calcularDiasAtraso(emprestimo),
      multaCalculada: this.calcularMulta(emprestimo),
    };
    this.devolucaoDialog = true;
  }

  confirmarRecebimento(): void {
    const prazoBase = new Date(this.devolucaoSelecionada.created_at);
    prazoBase.setDate(prazoBase.getDate() + 7);

    const payload = {
      idEmprestimo:  this.devolucaoSelecionada.id,
      VistoriadoPor: this.funcionarioLogadoId,
      dataPrevisao:  prazoBase.toISOString().split('T')[0],
    };

    this.emprestimosService.ConfirmarDevolucao(payload).subscribe({
      next: (res) => {
        const detalhe = res.aviso
          ? `Devolução registrada. ${res.aviso}`
          : `"${this.devolucaoSelecionada.livro?.Titulo}" devolvido ao estoque.`;

        this.messageService.add({
          severity: res.multaAplicada > 0 ? 'warn' : 'success',
          summary: 'Devolução Confirmada',
          detail: detalhe,
          life: 6000,
        });

        // Remove da lista local imediatamente
        this.emprestimosAtivos = this.emprestimosAtivos.filter(
          (e) => e.id !== this.devolucaoSelecionada.id,
        );
        this.devolucaoDialog = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao confirmar devolução');
      },
    });
  }

  formatarData(data: string | undefined): string {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  getPrazoFormatado(emp: EmprestimoDB): string {
    if (!emp.created_at) return '—';
    const prazo = new Date(emp.created_at);
    prazo.setDate(prazo.getDate() + 7);
    return prazo.toLocaleDateString('pt-BR');
  }
}
