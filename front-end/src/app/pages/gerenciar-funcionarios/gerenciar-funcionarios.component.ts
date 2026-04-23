import { Component, inject, OnInit } from '@angular/core';
import { FuncionariosLogados } from 'src/app/models/funcionarios.model';
import { FuncionariosService } from 'src/app/services/Funcionarios.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-gerenciar-funcionarios',
  templateUrl: './gerenciar-funcionarios.component.html',
  styleUrls: ['./gerenciar-funcionarios.component.scss'],
})
export class GerenciarFuncionariosComponent implements OnInit {
  private FuncionarioService = inject(FuncionariosService);
  private alert              = inject(AlertService);

  isModalOpen = false;
  isEditMode  = false;
  filtroTexto = '';
  loading     = true;

  funcionarioSelecionado: any = {};
  funcionarios: FuncionariosLogados[] = [];
  funcionariosFiltrados: FuncionariosLogados[] = [];

  perfisDisponiveis = [
    { label: 'Administrador', value: 1 },
    { label: 'Bibliotecário', value: 2 },
    { label: 'Financeiro',    value: 3 },
    { label: 'Estoque',       value: 4 },
    { label: 'Usuário',       value: 5 },
  ];

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.loading = true;
    this.FuncionarioService.BuscarFuncionarios().subscribe({
      next: (res) => {
        this.funcionarios = res;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar funcionários');
        this.loading = false;
      },
    });
  }

  aplicarFiltro(): void {
    const txt = this.filtroTexto.toLowerCase();
    this.funcionariosFiltrados = this.funcionarios.filter(
      (f) =>
        f.NomeFunc?.toLowerCase().includes(txt) ||
        f.MatriculaFunc?.toLowerCase().includes(txt),
    );
  }

  abrirModal(funcionario?: FuncionariosLogados): void {
    this.isEditMode = !!funcionario;
    this.funcionarioSelecionado = funcionario ? { ...funcionario } : { Status: 1 };
    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.isModalOpen = false;
    this.funcionarioSelecionado = {};
  }

  salvar(): void {
    if (this.isEditMode) {
      this.FuncionarioService.UpdateFuncionario(this.funcionarioSelecionado).subscribe({
        next: () => {
          this.alert.toastSuccess('Funcionário atualizado');
          this.fecharModal();
          this.carregarFuncionarios();
        },
        error: () => this.alert.error('Erro', 'Falha ao atualizar'),
      });
    } else {
      this.FuncionarioService.CriarFuncionario(this.funcionarioSelecionado).subscribe({
        next: () => {
          this.alert.toastSuccess('Funcionário cadastrado');
          this.fecharModal();
          this.carregarFuncionarios();
        },
        error: () => this.alert.error('Erro', 'Falha ao cadastrar'),
      });
    }
  }

  async excluir(id: number): Promise<void> {
    const ok = await this.alert.confirm('Excluir', 'Deseja remover este funcionário?');
    if (!ok) return;

    this.FuncionarioService.DeleteFuncionario(id).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter((f) => f.id !== id);
        this.aplicarFiltro();
        this.alert.toastSuccess('Funcionário removido');
      },
      error: () => this.alert.error('Erro', 'Falha ao excluir'),
    });
  }

  getIniciais(nome: string): string {
    return nome
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '?';
  }
}
