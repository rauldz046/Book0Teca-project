import { Component, inject } from '@angular/core';
import { ActivatedRoute,NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mostrarLogin = false;
  title = 'BookOTeca.com.br';
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  

   ngOnInit() {
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const rota = this.route.firstChild;
      this.mostrarLogin = rota?.snapshot.data['mostrarLogin'] ?? false;
    });
  }
}
