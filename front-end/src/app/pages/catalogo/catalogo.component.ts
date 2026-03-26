import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  @Input() book: any;
   // Mock de Perfil (Isso viria do seu AuthService)
  userRole: 'LEITOR' | 'BIBLIOTECARIO' | 'ADMINISTRADOR' | 'ESTOQUE' = 'LEITOR';

  // Mock de Dados
  books = [
    { id: 1, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', price: 49.90, stock: 5, status: 'DISPONIVEL', category: 'Fantasia', cover: 'https://m.media-amazon.com/images/I/81hCVAsN8pL.jpg' },
    { id: 2, title: '1984', author: 'George Orwell', price: 35.00, stock: 0, status: 'EMPRESTADO', category: 'Distopia', cover: 'https://m.media-amazon.com/images/I/819js3EQwbL.jpg' },
    // ... mais livros
  ];

  filteredBooks = [...this.books];

  ngOnInit(): void {}

  onSearch(query: string) {
    this.filteredBooks = this.books.filter(b => 
      b.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  

}
