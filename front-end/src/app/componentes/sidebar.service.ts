import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AuthService, UserProfile } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsedSubject.asObservable();

  private auth = inject(AuthService);

  get currentUserProfile(): UserProfile | null {
    return this.auth.profile;
  }

  toggle() {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  // Retorna a lista plana (flat) apenas com o que o usuário pode ver
  getSearchableRoutes(): any[] {
    const menuComPermissao = this.generateMenu();
    return this.flattenMenu(menuComPermissao);
  }

  private flattenMenu(items: MenuItem[], parentLabel: string = ''): any[] {
    let flat: any[] = [];
    items.forEach((item) => {
      if (item.items) {
        flat = [...flat, ...this.flattenMenu(item.items, item.label!)];
      } else if (item.routerLink) {
        flat.push({
          label: item.label,
          icon: item.icon,
          routerLink: item.routerLink,
          category: parentLabel,
        });
      }
    });
    return flat;
  }

  hasPermission(allowedProfiles: UserProfile[]): boolean {
    return this.auth.hasProfile(allowedProfiles);
  }

  generateMenu(): MenuItem[] {
    const fullMenu = [
      {
        label: 'Usuários',
        icon: PrimeIcons.USERS,
        visible: this.hasPermission(['BIBLIOTECARIO']),
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
            visible: this.hasPermission([]), // só ADMIN
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
            routerLink: '/acervo/autores',
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
            routerLink: '/inventario/licitacoes',
            visible: this.hasPermission(['ESTOQUE']),
          },
          {
            label: 'Tesouraria',
            icon: PrimeIcons.DOLLAR,
            routerLink: '/inventario/tesouraria',
            visible: this.hasPermission(['FINANCEIRO']),
          },
        ],
      },
      {
        label: 'Sistema',
        icon: PrimeIcons.SERVER,
        visible: this.hasPermission([]), // só ADMIN
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
        visible: true,
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
      .filter((i) => i.visible !== false)
      .map((i) => {
        if (i.items) i.items = this.filterMenu(i.items);
        return i;
      });
  }
}
