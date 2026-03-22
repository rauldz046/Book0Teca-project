import { ThisReceiver } from '@angular/compiler';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-componente-title',
  templateUrl: './componente-title.component.html',
  styleUrls: ['./componente-title.component.scss'],
})
export class ComponenteTitleComponent implements OnInit {
  titulo = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  userNome: string = 'ra';
  urlAtiva: string = '';

  ngOnInit(): void {
  // Atualiza na inicialização
  this.atualizarTitulo();
  this.urlAtiva = this.router.url;

  // Atualiza sempre que a rota muda
  this.router.events
    .pipe(
      filter(
        (event): event is NavigationEnd => event instanceof NavigationEnd
      )
    )
    .subscribe((event) => {
      this.urlAtiva = event.urlAfterRedirects;
      this.atualizarTitulo();
    });
}

  private atualizarTitulo() {
    let rotaAtiva = this.route;
    while (rotaAtiva.firstChild) {
      rotaAtiva = rotaAtiva.firstChild;
    }

    this.titulo = rotaAtiva.snapshot.data['titulo'] || '';
     this.userNome = rotaAtiva.snapshot.data['userNome'] || '';
  }
}
