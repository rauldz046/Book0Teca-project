import { Component, OnInit } from '@angular/core';

interface Funcionario {
  id?: number;
  matricula: string;
  nome: string;
  email: string;
  cpf: string;
  regiao: string;
  ativo: boolean;
  perfil: string;
}

@Component({
  selector: 'app-gerenciar-funcionarios',
  templateUrl: './gerenciar-funcionarios.component.html',
  styleUrls: ['./gerenciar-funcionarios.component.scss'],
})
export class GerenciarFuncionariosComponent implements OnInit {
  isModalOpen = false;
  isEditMode = false;
  filtroTexto = '';

  // Objeto para o formulário
  funcionarioSelecionado: any = {};

  funcionarios: Funcionario[] = [
    {
      id: 1,
      matricula: 'FUNC001',
      nome: 'Maria Souza',
      email: 'maria@email.com',
      cpf: '000.000.000-00',
      regiao: 'MG',
      ativo: true,
      perfil: 'Administrador',
    },
    {
      id: 2,
      matricula: 'FUNC002',
      nome: 'João Silva',
      email: 'joao@email.com',
      cpf: '111.111.111-11',
      regiao: 'SP',
      ativo: false,
      perfil: 'Bibliotecário',
    },
    {
      id: 3,
      matricula: 'FUNC003',
      nome: 'Ana Costa',
      email: 'ana.costa@email.com',
      cpf: '222.222.222-22',
      regiao: 'RJ',
      ativo: true,
      perfil: 'Atendente',
    },
    {
      id: 4,
      matricula: 'FUNC004',
      nome: 'Carlos Oliveira',
      email: 'carlos.o@email.com',
      cpf: '333.333.333-33',
      regiao: 'RS',
      ativo: true,
      perfil: 'Bibliotecário',
    },
  ];

  funcionariosFiltrados: Funcionario[] = [];

  ngOnInit() {
    this.funcionariosFiltrados = this.funcionarios;
  }

  aplicarFiltro() {
    this.funcionariosFiltrados = this.funcionarios.filter(
      (f) =>
        f.nome.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        f.matricula.toLowerCase().includes(this.filtroTexto.toLowerCase()),
    );
  }

  abrirModal(funcionario?: Funcionario) {
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
    // Lógica para salvar ou atualizar
    console.log('Salvando...', this.funcionarioSelecionado);
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
