import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface CardUsuario {
  titulo: string;
  descricao: string;
  icone: string;
  rota: string;
  cor: string;
  stat: string;
  statLabel: string;
  perfisPermitidos: string[];
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent {
  // Perfil do usuário logado — virá de um AuthService no back-end real
  // Troque para 'BIBLIOTECARIO' pra ver que o card de Funcionários some
  perfilLogado = 'ADMINISTRADOR';

  cards: CardUsuario[] = [
    {
      titulo: 'Leitores',
      descricao: 'Cadastro, histórico de empréstimos e situação de cada leitor da biblioteca.',
      icone: 'pi pi-users',
      rota: '/usuarios/leitores',
      cor: '#3b82f6',
      stat: '142',
      statLabel: 'leitores ativos',
      perfisPermitidos: ['ADMINISTRADOR', 'BIBLIOTECARIO'],
    },
    {
      titulo: 'Funcionários',
      descricao: 'Gerenciamento de colaboradores, matrículas, perfis e status de atividade.',
      icone: 'pi pi-id-card',
      rota: '/usuarios/funcionarios',
      cor: '#10b981',
      stat: '12',
      statLabel: 'funcionários cadastrados',
      perfisPermitidos: ['ADMINISTRADOR'],
    },
    {
      titulo: 'Permissões',
      descricao: 'Controle de acesso baseado em perfil (RBAC): Admin, Bibliotecário, Financeiro, Estoque e Leitor.',
      icone: 'pi pi-lock',
      rota: '/sistema/permissoes',
      cor: '#8b5cf6',
      stat: '5',
      statLabel: 'perfis configurados',
      perfisPermitidos: ['ADMINISTRADOR'],
    },
  ];

  constructor(private router: Router) {}

  get cardsVisiveis(): CardUsuario[] {
    return this.cards.filter((c) =>
      c.perfisPermitidos.includes(this.perfilLogado),
    );
  }

  navegar(rota: string): void {
    this.router.navigate([rota]);
  }
}
