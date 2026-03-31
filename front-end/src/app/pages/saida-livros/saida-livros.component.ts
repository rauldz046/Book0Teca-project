import { Component } from '@angular/core';

@Component({
  selector: 'app-saida-livros',
  templateUrl: './saida-livros.component.html',
  styleUrls: ['./saida-livros.component.scss']
})
export class SaidaLivrosComponent {
    saidas = [
    { livro: 'Java How to Program', isbn: '978-01347', data: new Date(), motivo: 'Dano Físico', responsavel: 'Carlos Almoxarife' },
    { livro: 'Design Patterns', isbn: '978-02016', data: new Date(), motivo: 'Extravio', responsavel: 'Carlos Almoxarife' }
  ];
  
  ngOnInit() {}
}


