import { Router, } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private readonly router = inject(Router);
  sidebarService = inject(SidebarService);

  searchQuery: any;
  searchableRoutes: any[] = [];
  filteredRoutes: any[] = [];

  ngOnInit() {
    // Carrega apenas as rotas permitidas para o usuário atual
    this.searchableRoutes = this.sidebarService.getSearchableRoutes();
  }

  filterRoutes(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRoutes = this.searchableRoutes.filter(
      (route) =>
        route.label.toLowerCase().includes(query) ||
        route.category.toLowerCase().includes(query),
    );
  }

  onSelectRoute(event: any) {
    this.router.navigate([event.routerLink]);
    this.searchQuery = null; // Limpa após navegar
  }
}
