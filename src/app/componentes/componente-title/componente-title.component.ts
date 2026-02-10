import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-componente-title',
  templateUrl: './componente-title.component.html',
  styleUrls: ['./componente-title.component.scss']
})
export class ComponenteTitleComponent implements OnInit {
  titulo = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Atualiza o título no carregamento da página
    this.atualizarTitulo();

    // Atualiza o título a cada mudança de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.atualizarTitulo());
  }

  private atualizarTitulo() {
    let rotaAtiva = this.route;
    while (rotaAtiva.firstChild) {
      rotaAtiva = rotaAtiva.firstChild;
    }

    this.titulo = rotaAtiva.snapshot.data['titulo'] || '';
  }
}
