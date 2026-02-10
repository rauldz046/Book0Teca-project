import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  items: MenuItem[] = [];
  collapsed = false;
  userNome: string = 'Usuário';
  OptionSelected!: string;
  private readonly router = inject(Router);
  

  usersDropdown = [
    { name: 'Perfil', code: '/clientes' },
    { name: 'Configurações', code: '/' },
    { name: 'Logout', code: '/' },
    { name: this.userNome, code: '' },
  ];

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
  get filteredDropdown() {
    return this.usersDropdown.filter((user) => user.name !== this.userNome);
  }

    navigateOut(route: any): void {
    this.router.navigate([route.code]).then(() => {
      if (this.OptionSelected) {
        this.OptionSelected = this.userNome;
      }
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Usuários@',
        icon: PrimeIcons.USERS,
        items: [
          {
            label: 'Gerenciar Leitores@',
            icon: PrimeIcons.USER,
            routerLink: '/usuarios/leitores',
          },
          {
            label: 'Geren. Funcionários@',
            icon: PrimeIcons.ID_CARD,
            routerLink: '/usuarios/funcionarios',
          },
        ],
      },
      {
        label: 'Acervo',
        icon: PrimeIcons.BOOK,
        items: [
          {
            label: 'Catalogo',
            icon: PrimeIcons.BOOK,
            routerLink: '/acervo/livros',
          },
          {
            label: 'Autores',
            icon: PrimeIcons.PENCIL,
            routerLink: '/acervo/autores',
          },
          {
            label: 'Editoras',
            icon: PrimeIcons.BUILDING,
            routerLink: '/acervo/editoras',
          },
        ],
      },
      {
        label: 'Empréstimos',
        icon: PrimeIcons.EXTERNAL_LINK,
        items: [
          {
            label: 'Meus Empréstimos',
            icon: PrimeIcons.CALENDAR,
            routerLink: '/emprestimos/ativos',
          },
          {
            label: 'Devoluções',
            icon: PrimeIcons.REFRESH,
            routerLink: '/emprestimos/devolucoes',
          },
          {
            label: 'Reservas',
            icon: PrimeIcons.BOOKMARK,
            routerLink: '/emprestimos/reservas',
          },
        ],
      },
      {
        label: 'Multas',
        icon: PrimeIcons.WALLET,
        items: [
          {
            label: 'Multas Pendentes',
            icon: PrimeIcons.EXCLAMATION_TRIANGLE,
            routerLink: '/multas/pendentes',
          },
          {
            label: 'Boletos',
            icon: PrimeIcons.CREDIT_CARD,
            routerLink: '/multas/pagamentos',
          },
          {
            label: 'Atividade',
            icon: PrimeIcons.CALENDAR,
            routerLink: '/multas/atividade',
          },
        ],
      },
      {
        label: 'Relatórios@',
        icon: PrimeIcons.CHART_BAR,
        items: [
          {
            label: 'Baixa de Livros@',
            icon: PrimeIcons.CHART_LINE,
            routerLink: '/relatorios/saidas',
          },
          {
            label: 'Empréstimos Ativos',
            icon: PrimeIcons.CALENDAR,
            routerLink: '/relatorios/emprestimos-ativos',
          },
          {
            label: 'Financeiro@',
            icon: PrimeIcons.DOLLAR,
            routerLink: '/relatorios/financeiro',
          },
        ],
      },
      {
        label: 'Sistema@',
        icon: PrimeIcons.SERVER,
        items: [
          {
            label: 'Logs@',
            icon: PrimeIcons.FILE,
            routerLink: '/sistema/logs',
          },
        ],
      },
      {
        label: 'Configurações',
        icon: PrimeIcons.COG,
        items: [
          {
            label: 'Perfil',
            icon: PrimeIcons.USER,
            routerLink: '/config/perfil',
          },
          {
            label: 'Permissões@',
            icon: PrimeIcons.LOCK,
            routerLink: '/config/permissoes',
          },
          {
            label: 'Privacidade',
            icon: PrimeIcons.EYE,
            routerLink: '/config/privacidade',
          },
          {
            label: 'Preferências',
            icon: PrimeIcons.SLIDERS_H,
            routerLink: '/config/preferencias',
          },
        ],
      },
    ];
  }
}
