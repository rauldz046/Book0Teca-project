import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

type StatusLivro = 'DISPONIVEL' | 'EMPRESTADO' | 'RESERVADO';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  status: StatusLivro;
  capa: string;
  ano: number;
  favorito?: boolean; // Novo
  noCarrinho?: boolean; // Novo
}

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  livros: Livro[] = [
    {
      id: 1,
      titulo: 'O Senhor dos Anéis',
      autor: 'J.R.R. Tolkien',
      categoria: 'Fantasia',
      status: 'DISPONIVEL',
      ano: 1954,
      capa: 'https://m.media-amazon.com/images/I/81hCVAsN8pL.jpg',
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      categoria: 'Distopia',
      status: 'EMPRESTADO',
      ano: 1949,
      capa: 'https://m.media-amazon.com/images/I/819js3EQwbL.jpg',
    },
    {
      id: 3,
      titulo: 'O Iluminado',
      autor: 'Stephen King',
      categoria: 'Terror',
      status: 'DISPONIVEL',
      ano: 1977,
      capa: 'https://m.media-amazon.com/images/I/91S77Sg9u8L.jpg',
    },
    {
      id: 4,
      titulo: 'Duna',
      autor: 'Frank Herbert',
      categoria: 'Ficção Científica',
      status: 'RESERVADO',
      ano: 1965,
      capa: 'https://m.media-amazon.com/images/I/81zN7udGRUL.jpg',
    },
    {
      id: 5,
      titulo: 'Hábitos Atômicos',
      autor: 'James Clear',
      categoria: 'Autoajuda',
      status: 'DISPONIVEL',
      ano: 2018,
      capa: 'https://m.media-amazon.com/images/I/81Yp6S6n7vL.jpg',
    },
    {
      id: 6,
      titulo: 'A Garota do Lago',
      autor: 'Charlie Donlea',
      categoria: 'Suspense',
      status: 'DISPONIVEL',
      ano: 2016,
      capa: 'https://m.media-amazon.com/images/I/81fS6i7E9LL.jpg',
    },
    {
      id: 7,
      titulo: 'Sapiens',
      autor: 'Yuval Noah Harari',
      categoria: 'História',
      status: 'DISPONIVEL',
      ano: 2011,
      capa: 'https://m.media-amazon.com/images/I/71Yf9u936aL.jpg',
    },
    {
      id: 8,
      titulo: 'O Pequeno Príncipe',
      autor: 'Antoine de Saint-Exupéry',
      categoria: 'Infantil',
      status: 'DISPONIVEL',
      ano: 1943,
      capa: 'https://m.media-amazon.com/images/I/71u9S+7qGGL.jpg',
    },
    {
      id: 9,
      titulo: 'Corte de Espinhos e Rosas',
      autor: 'Sarah J. Maas',
      categoria: 'Romance',
      status: 'EMPRESTADO',
      ano: 2015,
      capa: 'https://m.media-amazon.com/images/I/818pB6Y66TL.jpg',
    },
    {
      id: 10,
      titulo: 'O Alquimista',
      autor: 'Paulo Coelho',
      categoria: 'Ficção',
      status: 'DISPONIVEL',
      ano: 1988,
      capa: 'https://m.media-amazon.com/images/I/81S6-M8W8iL.jpg',
    },
    {
      id: 11,
      titulo: 'A Revolução dos Bichos',
      autor: 'George Orwell',
      categoria: 'Distopia',
      status: 'DISPONIVEL',
      ano: 1945,
      capa: 'https://m.media-amazon.com/images/I/91BP88A7p2L.jpg',
    },
    {
      id: 12,
      titulo: 'It: A Coisa',
      autor: 'Stephen King',
      categoria: 'Terror',
      status: 'RESERVADO',
      ano: 1986,
      capa: 'https://m.media-amazon.com/images/I/81XmD0kY8mL.jpg',
    },
    {
      id: 13,
      titulo: 'Mulheres que Correm com os Lobos',
      autor: 'Clarissa Pinkola Estés',
      categoria: 'Psicologia',
      status: 'DISPONIVEL',
      ano: 1992,
      capa: 'https://m.media-amazon.com/images/I/817-YvXG8pL.jpg',
    },
    {
      id: 14,
      titulo: 'Pai Rico, Pai Pobre',
      autor: 'Robert Kiyosaki',
      categoria: 'Finanças',
      status: 'DISPONIVEL',
      ano: 1997,
      capa: 'https://m.media-amazon.com/images/I/81De96vSbfL.jpg',
    },
    {
      id: 15,
      titulo: 'Dom Casmurro',
      autor: 'Machado de Assis',
      categoria: 'Clássico',
      status: 'DISPONIVEL',
      ano: 1899,
      capa: 'https://m.media-amazon.com/images/I/71C7NInW3tL.jpg',
    },
    {
      id: 16,
      titulo: 'O Código Da Vinci',
      autor: 'Dan Brown',
      categoria: 'Suspense',
      status: 'EMPRESTADO',
      ano: 2003,
      capa: 'https://m.media-amazon.com/images/I/81E6N6X0LTL.jpg',
    },
    {
      id: 17,
      titulo: 'Admirável Mundo Novo',
      autor: 'Aldous Huxley',
      categoria: 'Ficção Científica',
      status: 'DISPONIVEL',
      ano: 1932,
      capa: 'https://m.media-amazon.com/images/I/81mS1GfA8vL.jpg',
    },
    {
      id: 18,
      titulo: 'A Menina que Roubava Livros',
      autor: 'Markus Zusak',
      categoria: 'Drama',
      status: 'DISPONIVEL',
      ano: 2005,
      capa: 'https://m.media-amazon.com/images/I/91mS33NscLL.jpg',
    },
    {
      id: 19,
      titulo: 'O Hobbit',
      autor: 'J.R.R. Tolkien',
      categoria: 'Fantasia',
      status: 'DISPONIVEL',
      ano: 1937,
      capa: 'https://m.media-amazon.com/images/I/91M9pPrcAsL.jpg',
    },
    {
      id: 20,
      titulo: 'Orgulho e Preconceito',
      autor: 'Jane Austen',
      categoria: 'Clássico',
      status: 'DISPONIVEL',
      ano: 1813,
      capa: 'https://m.media-amazon.com/images/I/712XUccSscL.jpg',
    },
  ];

  livrosFiltrados: Livro[] = [];
  categorias: string[] = [];
  filtroTexto: string = '';
  categoriasSelecionadas: string[] = [];
  apenasDisponiveis: boolean = false;
  loading = false;

  private filtroSubject = new Subject<void>();

  ngOnInit() {
    this.livrosFiltrados = this.livros;
    this.categorias = [...new Set(this.livros.map((l) => l.categoria))].sort();
    this.filtroSubject
      .pipe(debounceTime(300))
      .subscribe(() => this.aplicarFiltro());
  }

  // AÇÕES DO USUÁRIO
  toggleFavorito(livro: Livro) {
    livro.favorito = !livro.favorito;
    // Aqui você chamaria o serviço para salvar no banco
  }

  adicionarCarrinho(livro: Livro) {
    livro.noCarrinho = !livro.noCarrinho;
    // Feedback visual (ex: Toast) poderia ser usado aqui
  }

  solicitarEmprestimo(livro: Livro) {
    if (livro.status === 'DISPONIVEL') {
      console.log(`Solicitando empréstimo do livro: ${livro.titulo}`);
      // Lógica de backend aqui
    }
  }

  // FILTROS
  filtrar() {
    this.filtroSubject.next();
  }

  aplicarFiltro() {
    const texto = this.filtroTexto.toLowerCase();
    this.livrosFiltrados = this.livros.filter((livro) => {
      const matchTexto =
        livro.titulo.toLowerCase().includes(texto) ||
        livro.autor.toLowerCase().includes(texto);
      const matchCategoria =
        !this.categoriasSelecionadas.length ||
        this.categoriasSelecionadas.includes(livro.categoria);
      const matchDisponibilidade =
        !this.apenasDisponiveis || livro.status === 'DISPONIVEL';
      return matchTexto && matchCategoria && matchDisponibilidade;
    });
  }

  limparFiltros() {
    this.filtroTexto = '';
    this.categoriasSelecionadas = [];
    this.apenasDisponiveis = false;
    this.aplicarFiltro();
  }

  trackById(index: number, item: Livro) {
    return item.id;
  }

  formatarStatus(status: StatusLivro) {
    const map = {
      DISPONIVEL: 'Disponível',
      EMPRESTADO: 'Emprestado',
      RESERVADO: 'Reservado',
    };
    return map[status];
  }

  getSeverity(status: StatusLivro) {
    switch (status) {
      case 'DISPONIVEL':
        return 'success';
      case 'EMPRESTADO':
        return 'danger';
      case 'RESERVADO':
        return 'warning';
      default:
        return 'info';
    }
  }
}
