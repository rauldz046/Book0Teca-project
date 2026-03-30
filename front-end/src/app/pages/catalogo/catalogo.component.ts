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
  link?: string; // 👈 NOVO
  favorito?: boolean;
  noCarrinho?: boolean;
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
      link: 'https://www.amazon.com.br/dp/8595086354',
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      categoria: 'Distopia',
      status: 'EMPRESTADO',
      ano: 1949,
      capa: 'https://m.media-amazon.com/images/I/819js3EQwbL.jpg',
      link: 'https://www.amazon.com.br/dp/8535914846',
    },
    {
      id: 4,
      titulo: 'Duna',
      autor: 'Frank Herbert',
      categoria: 'Ficção Científica',
      status: 'RESERVADO',
      ano: 1965,
      capa: 'https://m.media-amazon.com/images/I/81zN7udGRUL.jpg',
      link: 'https://www.amazon.com.br/dp/857657313X',
    },
  ];

  livrosFiltrados: Livro[] = [];
  categorias: string[] = [];
  filtroTexto: string = '';
  categoriasSelecionadas: string[] = [];
  apenasDisponiveis: boolean = false;
  loading = false;
  exibirFiltros: boolean = true; // Começa aberto no desktop
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
  toggleFiltros() {
    this.exibirFiltros = !this.exibirFiltros;
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

  // No CatalogoComponent, adicione uma simulação de carregamento se quiser o efeito "shimmer"
  aplicarFiltro() {
    this.loading = true;
    const texto = this.filtroTexto.toLowerCase();

    // Simula um delay de rede para ver o efeito de catálogo carregando
    setTimeout(() => {
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
      this.loading = false;
    }, 200);
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
