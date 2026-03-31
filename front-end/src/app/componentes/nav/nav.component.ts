import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { BehaviorSubject, debounceTime, from } from 'rxjs';
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
    if (!localStorage.getItem('infoSessao')) {
      this.router.navigate(['/auth/log-in']);
    }
    this.items = this.sidebarService.generateMenu();
  }

 


}
