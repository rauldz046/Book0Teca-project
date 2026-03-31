import { Emprestimo } from 'src/app/models/emprestimos';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { Component, inject, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/Clientes.service';

@Component({
  selector: 'app-emprestimos-usuarios',
  templateUrl: './emprestimos-usuarios.component.html',
  styleUrls: ['./emprestimos-usuarios.component.scss'],
})
export class EmprestimosUsuariosComponent {
  emprestimos: Emprestimo[] = [];
  emprestimoDialog: boolean = false;
  novoEmprestimo: any = {
    usuario: null,
    livro: null,
    dataEmprestimo: null,
    dataPrevisaoDevolucao: null,
    status: 'ATIVO',
  };
  submitted: boolean = false;
  livrosDisponiveis: any[] = []; // Viria do seu BookService
  usuarios: any[] = []; //
  private clientesService = inject(ClientesService);
  private alert = inject(AlertService);

  ngOnInit() {
    this.carregarDadosIniciais();

    this.usuarios = [
      { id: 1, nome: 'João Silva' },
      { id: 2, nome: 'Maria Souza' },
    ];

    this.livrosDisponiveis = [
      { id: 1, titulo: 'O Senhor dos Anéis' },
      { id: 2, titulo: 'Angular Pro' },
    ];
  }

  carregarDadosIniciais() {
    // Simulação de dados
    this.emprestimos = [
      {
        id: 1,
        livroTitulo: 'O Senhor dos Anéis',
        leitor: 'João Silva',
        dataEmprestimo: new Date(),
        dataPrevisaoDevolucao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'ATIVO',
        renovacoes: 0,
        matricula: '2023001',
      },
      {
        id: 2,
        livroTitulo: 'Angular Pro',
        leitor: 'Maria Souza',
        dataEmprestimo: new Date(2023, 5, 1),
        dataPrevisaoDevolucao: new Date(2023, 5, 8),
        status: 'ATRASADO',
        renovacoes: 0,
        matricula: '2023002',
      },
    ];
  }

  abrirNovo() {
    this.novoEmprestimo = {
      usuario: null,
      livro: null,
      dataEmprestimo: new Date(),
      dataPrevisaoDevolucao: null,
      status: 'ATIVO',
    };

    this.emprestimoDialog = true;
  }

  fecharDialog() {
    this.emprestimoDialog = false;
    this.submitted = false;
  }

  salvarEmprestimo() {
    this.submitted = true;

    if (!this.novoEmprestimo.usuario || !this.novoEmprestimo.livro) {
      this.alert.error('Erro', 'Preencha todos os campos');
      return;
    }

    const novo = {
      id: Math.random(),
      livroTitulo: this.novoEmprestimo.livro.titulo,
      usuarioNome: this.novoEmprestimo.usuario.nome,
      dataEmprestimo: this.novoEmprestimo.dataEmprestimo,
      dataPrevisaoDevolucao: this.novoEmprestimo.dataPrevisaoDevolucao,
      status: 'ATIVO',
    };

    this.alert.success('Sucesso', 'Livro emprestado com sucesso');

    this.emprestimoDialog = false;
  }

  async devolverLivro(emprestimo: Emprestimo) {
    const confirm = await this.alert.confirm(
      'Confirmar Devolução',
      'Tem certeza que deseja devolver o livro?',
    );
    if (confirm) {
      emprestimo.status = 'DEVOLVIDO';
      this.alert.success('Sucesso', 'Livro devolvido com sucesso');
    }
  }

  renovarEmprestimo(emprestimo: Emprestimo) {
    // Adiciona mais 7 dias à data de previsão
    const novaData = new Date(emprestimo.dataPrevisaoDevolucao);
    novaData.setDate(novaData.getDate() + 7);
    emprestimo.dataPrevisaoDevolucao = novaData;
    emprestimo.status = 'ATIVO';

    this.alert.success('Sucesso', 'Livro renovado com sucesso');
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ATIVO':
        return 'info';
      case 'DEVOLVIDO':
        return 'success';
      case 'ATRASADO':
        return 'danger';
      case 'RENOVADO':
        return 'warning';
      default:
        return 'info';
    }
  }
}
