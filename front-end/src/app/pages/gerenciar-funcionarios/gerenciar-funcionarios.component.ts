import { Component } from '@angular/core';

@Component({
  selector: 'app-gerenciar-funcionarios',
  templateUrl: './gerenciar-funcionarios.component.html',
  styleUrls: ['./gerenciar-funcionarios.component.scss'],
})
export class GerenciarFuncionariosComponent {
  isModalOpen = false;

  // Dados fictícios para teste do ngFor
  funcionarios = [
    {
      id: 1,
      matricula: 'FUNC001',
      nome: 'Maria Souza',
      email: 'maria@email.com',
      regiao: 'MG',
      ativo: true,
    },
    {
      id: 2,
      matricula: 'FUNC002',
      nome: 'João Silva',
      email: 'joao@email.com',
      regiao: 'SP',
      ativo: false,
    },
  ];

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
}
