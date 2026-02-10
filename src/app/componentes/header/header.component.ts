import { Router, } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userNome: string = 'Usuário';
  OptionSelected!: string;

  usersDropdown = [
    { name: 'Perfil', code: '/clientes' },
    { name: 'Configurações', code: '/' },
    { name: 'Logout', code: '/' },
    { name: this.userNome, code: '' },
  ];

  private readonly router = inject(Router);

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
}
