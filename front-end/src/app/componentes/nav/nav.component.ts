import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  items: MenuItem[] = [];
  collapsed = false;
  userNome: string = '';
  currentUserProfile: UserProfile | null = null;
  OptionSelected!: string;

  private readonly router = inject(Router);
  sidebarService = inject(SidebarService);
  private auth = inject(AuthService);

  usersDropdown = [
    { name: 'Perfil', code: '/config/perfil' },
    { name: 'Configurações', code: '/' },
    { name: 'Logout', code: '/' },
    { name: this.userNome, code: '' },
  ];

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  /**
   * Persiste a sessão do usuário logado (chamado pelo login).
   * Dispara rebuild do menu automaticamente via AuthService.profile$.
   */
  infoAuthSessao(info: any) {
    this.auth.setSession(info);
  }

  get filteredDropdown() {
    return this.usersDropdown.filter((user) => user.name !== this.userNome);
  }

  navigateOut(route: any): void {
    if (route.name === 'Logout' || route.code === '/') {
      this.auth.logout();
      this.router.navigate(['/auth/log-in']);
      return;
    }
    this.router.navigate([route.code]).then(() => {
      if (this.OptionSelected) {
        this.OptionSelected = this.userNome;
      }
    });
  }

  ngOnInit() {
    if (!this.auth.isLogged) {
      this.router.navigate(['/auth/log-in']);
      return;
    }

    // Reage a mudanças de perfil (login/logout) regerando o menu
    this.auth.profile$.subscribe((perfil) => {
      this.currentUserProfile = perfil;
      const sess = this.auth.session;
      this.userNome = sess?.NomeFunc || sess?.Nome || sess?.Email || '';
      this.usersDropdown = [
        { name: 'Perfil', code: '/config/perfil' },
        { name: 'Configurações', code: '/config/perfil' },
        { name: 'Logout', code: '/' },
        { name: this.userNome, code: '' },
      ];
      this.items = this.sidebarService.generateMenu();
    });
  }
}
