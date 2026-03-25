import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Começa como false (aberta)
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  
  // Observable que os componentes vão escutar
  collapsed$ = this.collapsedSubject.asObservable();

  // Método para alternar
  toggle() {
    this.collapsedSubject.next(!this.collapsedSubject.value);
  }

  // Método para pegar o valor atual sem precisar assinar (útil as vezes)
  isCollapsed(): boolean {
    return this.collapsedSubject.value;
  }
}