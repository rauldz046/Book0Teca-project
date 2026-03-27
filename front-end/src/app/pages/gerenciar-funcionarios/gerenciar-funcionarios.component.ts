import { Component, inject, OnInit } from '@angular/core';
import { FuncionariosLogados } from 'src/app/models/funcionarios.model';
import { FuncionariosService } from 'src/app/services/Funcionarios.service';
@Component({
  selector: 'app-gerenciar-funcionarios',
  templateUrl: './gerenciar-funcionarios.component.html',
  styleUrls: ['./gerenciar-funcionarios.component.scss'],
})
export class GerenciarFuncionariosComponent implements OnInit {
  FuncionarioService = inject(FuncionariosService);
  isModalOpen = false;
  isEditMode = false;
  filtroTexto = '';

  // Objeto para o formulário
  funcionarioSelecionado: any = {};

  funcionarios: FuncionariosLogados[] = [
    {
      id: 1,
      MatriculaFunc: 'FUNC001',
      NomeFunc: 'Maria Souza',
      EmailFunc: 'maria@email.com',
      CPFFunc: '000.000.000-00',
      RegiaoFunc: 'MG',
      Status: 1,
      idPerfilFuncionarios: 'Administrador',
    },
    {
      id: 2,
      MatriculaFunc: 'FUNC002',
      NomeFunc: 'João Silva',
      EmailFunc: 'joao@email.com',
      CPFFunc: '111.111.111-11',
      RegiaoFunc: 'SP',
      Status: 1,
      idPerfilFuncionarios: 'Bibliotecário',
    },
    {
      id: 3,
      MatriculaFunc: 'FUNC003',
      NomeFunc: 'Ana Costa',
      EmailFunc: 'ana.costa@email.com',
      CPFFunc: '222.222.222-22',
      RegiaoFunc: 'RJ',
      Status: 1,
      idPerfilFuncionarios: 'Atendente',
    },
    {
      id: 4,
      MatriculaFunc: 'FUNC004',
      NomeFunc: 'Carlos Oliveira',
      EmailFunc: 'carlos.o@email.com',
      CPFFunc: '333.333.333-33',
      RegiaoFunc: 'RS',
      Status: 1,
      idPerfilFuncionarios: 'Bibliotecário',
    },
  ];

  funcionariosFiltrados: FuncionariosLogados[] = [];

  ngOnInit() {
    this.FuncionarioService.BuscarFuncionarios().subscribe((res) => {
      if (res !== null) {
        this.funcionarios = res;
        this.aplicarFiltro();
      }
    });
  }
  aplicarFiltro() {
    this.funcionariosFiltrados = this.funcionarios.filter(
      (f) =>
        f.NomeFunc.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        f.MatriculaFunc.toLowerCase().includes(this.filtroTexto.toLowerCase()),
    );
  }

  abrirModal(funcionario?: FuncionariosLogados) {
    this.isEditMode = !!funcionario;
    this.funcionarioSelecionado = funcionario
      ? { ...funcionario }
      : { ativo: true, perfil: '1' };
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
    this.funcionarioSelecionado = {};
  }

  salvar() {
    this.fecharModal();
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja remover este funcionário?')) {
      this.funcionarios = this.funcionarios.filter((f) => f.id !== id);
      this.aplicarFiltro();
    }
  }

  getIniciais(nome: string): string {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
