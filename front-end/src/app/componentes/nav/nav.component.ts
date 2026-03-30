import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../responsive-sidebar.service';
import { BehaviorSubject, debounceTime } from 'rxjs';
type UserProfile =
  | 'LEITOR'
  | 'BIBLIOTECARIO'
  | 'FINANCEIRO'
  | 'ESTOQUE'
  | 'ADMINISTRADOR';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  infoSessao = new BehaviorSubject<any>('');
  items: MenuItem[] = [];
  collapsed = false;
  userNome: string = 'raul.7lmg';
  currentUserProfile: UserProfile = 'ADMINISTRADOR';
  OptionSelected!: string;
  private readonly router = inject(Router);
  sidebarService = inject(SidebarService);

  usersDropdown = [
    { name: 'Perfil', code: '/config/perfil' },
    { name: 'Configurações', code: '/' },
    { name: 'Logout', code: '/' },
    { name: this.userNome, code: '' },
  ];

  toggleSidebar() {
    this.sidebarService.toggle();
  }
  infoAuthSessao(info: any) {
    // 1. Atualiza o BehaviorSubject (para os componentes ativos verem a mudança agora)
    this.infoSessao.next(info);

    // 2. Transforma o objeto 'info' em uma string JSON e salva
    localStorage.setItem('infoSessao', JSON.stringify(info));
  }
  get filteredDropdown() {
    return this.usersDropdown.filter((user) => user.name !== this.userNome);
  }

  navigateOut(route: any): void {
    if (route.code === '/') {
      localStorage.removeItem('infoSessao');
      this.router.navigate(['/auth/log-in']);
    }
    this.router.navigate([route.code]).then(() => {
      if (this.OptionSelected) {
        this.OptionSelected = this.userNome;
      }
    });
  }

  ngOnInit() {
    console.log(localStorage.getItem('infoSessao'));
    // if(!localStorage.getItem('infoSessao')) {
    //   this.router.navigate(['/auth/log-in']);
    // }
    this.items = this.generateMenu();
  }

  /**
   * Centraliza a lógica de permissões.
   * Retorna true se o perfil do usuário estiver na lista de perfis permitidos.
   */
  hasPermission(allowedProfiles: UserProfile[]): boolean {
    if (this.currentUserProfile === 'ADMINISTRADOR') return true; // Admin vê tudo
    return allowedProfiles.includes(this.currentUserProfile);
  }

  generateMenu(): MenuItem[] {
    const fullMenu = [
      {
        label: 'Usuários',
        icon: PrimeIcons.USERS,
        visible: this.hasPermission(['BIBLIOTECARIO']), // Admin e Bibliotecário
        items: [
          {
            label: 'Gerenciar Leitores',
            icon: PrimeIcons.USER,
            routerLink: '/usuarios/leitores',
            visible: this.hasPermission(['BIBLIOTECARIO']),
          },
          {
            label: 'Geren. Funcionários',
            icon: PrimeIcons.ID_CARD,
            routerLink: '/usuarios/funcionarios',
            visible: this.hasPermission([]), // Apenas Admin (visto que a lista está vazia e admin ignora)
          },
        ],
      },
      {
        label: 'Acervo',
        icon: PrimeIcons.BOOK,
        visible: this.hasPermission(['LEITOR', 'BIBLIOTECARIO', 'ESTOQUE']),
        items: [
          {
            label: 'Catalogo',
            icon: PrimeIcons.BOOK,
            routerLink: '/acervo/livros',
            visible: true,
          },
          {
            label: 'Autores',
            icon: PrimeIcons.PENCIL,
            visible: this.hasPermission(['BIBLIOTECARIO']),
          },
        ],
      },
      {
        label: 'Empréstimos',
        icon: PrimeIcons.EXTERNAL_LINK,
        visible: this.hasPermission(['LEITOR', 'BIBLIOTECARIO']),
        items: [
          {
            label: 'Meus Empréstimos',
            icon: PrimeIcons.CALENDAR,
            routerLink: '/emprestimos/ativos',
            visible: this.hasPermission(['LEITOR']),
          },
          {
            label: 'Devoluções',
            icon: PrimeIcons.REFRESH,
            routerLink: '/emprestimos/devolucoes',
            visible: this.hasPermission(['BIBLIOTECARIO']),
          },
        ],
      },
      {
        label: 'Multas',
        icon: PrimeIcons.WALLET,
        visible: this.hasPermission(['LEITOR', 'FINANCEIRO']),
        items: [
          {
            label: 'Multas Pendentes',
            icon: PrimeIcons.EXCLAMATION_TRIANGLE,
            routerLink: '/multas/pendentes',
            visible: this.hasPermission(['LEITOR', 'FINANCEIRO']),
          },
          {
            label: 'Boletos',
            icon: PrimeIcons.CREDIT_CARD,
            visible: this.hasPermission(['FINANCEIRO']),
          },
        ],
      },
      {
        label: 'Relatórios',
        icon: PrimeIcons.CHART_BAR,
        visible: this.hasPermission(['BIBLIOTECARIO', 'FINANCEIRO', 'ESTOQUE']),
        items: [
          {
            label: 'Baixa de Livros',
            icon: PrimeIcons.CHART_LINE,
            routerLink: '/relatorios/saidas',
            visible: this.hasPermission(['ESTOQUE']),
          },
          {
            label: 'Empréstimos Ativos',
            icon: PrimeIcons.CALENDAR,
            routerLink: '/relatorios/emprestimos-ativos',
            visible: this.hasPermission(['BIBLIOTECARIO']),
          },
          {
            label: 'Financeiro',
            icon: PrimeIcons.DOLLAR,
            routerLink: '/relatorios/financeiro',
            visible: this.hasPermission(['FINANCEIRO']),
          },
        ],
      },
      {
        label: 'Inventario',
        icon: PrimeIcons.BOX,
        visible: this.hasPermission(['ESTOQUE', 'FINANCEIRO']),
        items: [
          {
            label: 'Estoque',
            icon: PrimeIcons.WALLET,
            routerLink: '/inventario/Estoque',
            visible: this.hasPermission(['ESTOQUE']),
          },
          {
            label: 'Licitações',
            icon: PrimeIcons.PAPERCLIP,
            routerLink: '/inventario/Estoque',
            visible: this.hasPermission(['ESTOQUE']),
          },
          {
            label: 'Tesouraria',
            icon: PrimeIcons.DOLLAR,
            routerLink: '/inventario/Estoque',
            visible: this.hasPermission(['FINANCEIRO']),
          },
        ],
      },
      {
        label: 'Sistema',
        icon: PrimeIcons.SERVER,
        visible: this.hasPermission([]), // Apenas Admin
        items: [
          { label: 'Logs', icon: PrimeIcons.FILE, routerLink: '/sistema/logs' },
          {
            label: 'Permissões',
            icon: PrimeIcons.LOCK,
            routerLink: '/sistema/permissoes',
          },
        ],
      },
      {
        label: 'Configurações',
        icon: PrimeIcons.COG,
        visible: true, // Todos veem
        items: [
          {
            label: 'Perfil',
            icon: PrimeIcons.USER,
            routerLink: '/config/perfil',
          },
        ],
      },
    ];

    return this.filterMenu(fullMenu);
  }

  filterMenu(menuItems: MenuItem[]): MenuItem[] {
    return menuItems
      .filter((item) => item.visible !== false)
      .map((item) => {
        if (item.items) {
          item.items = this.filterMenu(item.items);
        }
        return item;
      });
  }
}
