import { Component, OnInit } from '@angular/core';

type StatusLivro = 'DISPONIVEL' | 'EMPRESTADO' | 'RESERVADO';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  status: StatusLivro;
  capa: string;
  ano: number;
  favorito?: boolean;
  noCarrinho?: boolean;
}

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  // Lista expandida para comportar as categorias
  livros: Livro[] = [
    // FANTASIA
    {
      id: 1,
      titulo: 'O Senhor dos Anéis',
      autor: 'J.R.R. Tolkien',
      categoria: 'Fantasia',
      status: 'DISPONIVEL',
      ano: 1954,
      capa: 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
    },
    {
      id: 5,
      titulo: 'O Hobbit',
      autor: 'J.R.R. Tolkien',
      categoria: 'Fantasia',
      status: 'DISPONIVEL',
      ano: 1937,
      capa: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
    },
    {
      id: 11,
      titulo: 'Harry Potter',
      autor: 'J.K. Rowling',
      categoria: 'Fantasia',
      status: 'DISPONIVEL',
      ano: 1997,
      capa: 'https://covers.openlibrary.org/b/id/7984916-L.jpg',
    },
    {
      id: 12,
      titulo: 'As Crônicas de Nárnia',
      autor: 'C.S. Lewis',
      categoria: 'Fantasia',
      status: 'DISPONIVEL',
      ano: 1950,
      capa: 'https://covers.openlibrary.org/b/id/11153223-L.jpg',
    },

    // PROGRAMAÇÃO
    {
      id: 4,
      titulo: 'Código Limpo',
      autor: 'Robert C. Martin',
      categoria: 'Programação',
      status: 'DISPONIVEL',
      ano: 2008,
      capa: 'https://covers.openlibrary.org/b/id/9611981-L.jpg',
    },
    {
      id: 13,
      titulo: 'Arquitetura Limpa',
      autor: 'Robert C. Martin',
      categoria: 'Programação',
      status: 'DISPONIVEL',
      ano: 2017,
      capa: 'https://covers.openlibrary.org/b/id/9259251-L.jpg',
    },
    {
      id: 14,
      titulo: 'Refatoração',
      autor: 'Martin Fowler',
      categoria: 'Programação',
      status: 'EMPRESTADO',
      ano: 1999,
      capa: 'https://covers.openlibrary.org/b/id/8101356-L.jpg',
    },
    {
      id: 15,
      titulo: 'Padrões de Projeto',
      autor: 'GoF',
      categoria: 'Programação',
      status: 'DISPONIVEL',
      ano: 1994,
      capa: 'https://covers.openlibrary.org/b/id/8235116-L.jpg',
    },

    // CLÁSSICOS
    {
      id: 6,
      titulo: 'Orgulho e Preconceito',
      autor: 'Jane Austen',
      categoria: 'Clássico',
      status: 'EMPRESTADO',
      ano: 1813,
      capa: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    },
    {
      id: 10,
      titulo: 'O Grande Gatsby',
      autor: 'F. Scott Fitzgerald',
      categoria: 'Clássico',
      status: 'DISPONIVEL',
      ano: 1925,
      capa: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    },
    {
      id: 16,
      titulo: 'Dom Casmurro',
      autor: 'Machado de Assis',
      categoria: 'Clássico',
      status: 'DISPONIVEL',
      ano: 1899,
      capa: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    },
    {
      id: 17,
      titulo: 'Cem Anos de Solidão',
      autor: 'Gabriel García Márquez',
      categoria: 'Clássico',
      status: 'RESERVADO',
      ano: 1967,
      capa: 'https://covers.openlibrary.org/b/id/8225631-L.jpg',
    },

    // FICÇÃO CIENTÍFICA
    {
      id: 3,
      titulo: 'Duna',
      autor: 'Frank Herbert',
      categoria: 'Ficção Científica',
      status: 'RESERVADO',
      ano: 1965,
      capa: 'https://covers.openlibrary.org/b/id/8108691-L.jpg',
    },
    {
      id: 18,
      titulo: 'Fundação',
      autor: 'Isaac Asimov',
      categoria: 'Ficção Científica',
      status: 'DISPONIVEL',
      ano: 1951,
      capa: 'https://covers.openlibrary.org/b/id/8235081-L.jpg',
    },
    {
      id: 19,
      titulo: 'Neuromancer',
      autor: 'William Gibson',
      categoria: 'Ficção Científica',
      status: 'DISPONIVEL',
      ano: 1984,
      capa: 'https://covers.openlibrary.org/b/id/8221256-L.jpg',
    },

    // SUSPENSE / HISTÓRIA
    {
      id: 8,
      titulo: 'A Paciente Silenciosa',
      autor: 'Alex Michaelides',
      categoria: 'Suspense',
      status: 'RESERVADO',
      ano: 2019,
      capa: 'https://covers.openlibrary.org/b/id/10523338-L.jpg',
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      categoria: 'Distopia',
      status: 'EMPRESTADO',
      ano: 1949,
      capa: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    },
    {
      id: 9,
      titulo: 'Sapiens',
      autor: 'Yuval Noah Harari',
      categoria: 'História',
      status: 'DISPONIVEL',
      ano: 2011,
      capa: 'https://covers.openlibrary.org/b/id/8370226-L.jpg',
    },

    // AUTOAJUDA
    {
      id: 7,
      titulo: 'Hábitos Atômicos',
      autor: 'James Clear',
      categoria: 'Autoajuda',
      status: 'DISPONIVEL',
      ano: 2018,
      capa: 'https://covers.openlibrary.org/b/id/11141517-L.jpg',
    },
    {
      id: 20,
      titulo: 'O Poder do Hábito',
      autor: 'Charles Duhigg',
      categoria: 'Autoajuda',
      status: 'DISPONIVEL',
      ano: 2012,
      capa: 'https://covers.openlibrary.org/b/id/8165261-L.jpg',
    },
  ];
  fantasia = this.livros.filter((l) => l.categoria === 'Fantasia');
  programacao = this.livros.filter((l) => l.categoria === 'Programação');
  classicos = this.livros.filter((l) => l.categoria === 'Clássico');
  ficcao = this.livros.filter((l) => l.categoria === 'Ficção Científica');
  suspense = this.livros.filter((l) => l.categoria === 'Suspense');
  distopia = this.livros.filter((l) => l.categoria === 'Distopia');
  historia = this.livros.filter((l) => l.categoria === 'História');
  autoajuda = this.livros.filter((l) => l.categoria === 'Autoajuda');

  filtroTexto: string = '';
  categorias: string[] = [
    'Fantasia',
    'Programação',
    'Clássico',
    'Ficção Científica',
    'Autoajuda',
    'História',
  ];

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '991px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
  ];

  ngOnInit() {}

  // Função centralizada para filtrar livros em cada carrossel
  getLivrosPorCategoria(categoria: string): Livro[] {
    const texto = this.filtroTexto.toLowerCase();
    return this.livros.filter(
      (l) =>
        l.categoria === categoria &&
        (l.titulo.toLowerCase().includes(texto) ||
          l.autor.toLowerCase().includes(texto)),
    );
  }

  // Verifica se a categoria deve ser exibida (tem algum livro após o filtro)
  temLivrosNaCategoria(categoria: string): boolean {
    return this.getLivrosPorCategoria(categoria).length > 0;
  }

  toggleFavorito(livro: Livro) {
    livro.favorito = !livro.favorito;
  }
  adicionarCarrinho(livro: Livro) {
    livro.noCarrinho = !livro.noCarrinho;
  }
  formatarStatus(status: StatusLivro) {
    return status === 'DISPONIVEL'
      ? 'Disponível'
      : status === 'EMPRESTADO'
        ? 'Emprestado'
        : 'Reservado';
  }
  getSeverity(status: StatusLivro) {
    return status === 'DISPONIVEL'
      ? 'success'
      : status === 'EMPRESTADO'
        ? 'danger'
        : 'warning';
  }
}
