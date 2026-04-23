import { Component, OnInit, inject } from '@angular/core';
import { LivrosService } from 'src/app/services/Livros.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { Livro } from 'src/app/models/livros.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {
  private livrosService = inject(LivrosService);
  private alert = inject(AlertService);

  todosLivros: Livro[] = [];
  livrosFiltrados: Livro[] = [];
  loading = true;

  filtroTexto = '';
  filtroTipo: 'todos' | 'fisico' | 'digital' = 'todos';

  categorias: string[] = [];

  fantasia: Livro[] = [];
  programacao: Livro[] = [];
  classicos: Livro[] = [];
  ficcao: Livro[] = [];
  suspense: Livro[] = [];
  distopia: Livro[] = [];
  historia: Livro[] = [];

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 4, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '991px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
  ];

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.loading = true;
    this.livrosService.FindAll().subscribe({
      next: (res) => {
        this.todosLivros = res;
        this.livrosFiltrados = res;
        this.extrairCategorias();
        this.preencherColecoes();
        this.loading = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar catálogo de livros');
        this.loading = false;
      },
    });
  }

  extrairCategorias(): void {
    // Como o banco não tem campo Categoria ainda, agrupamos por autor
    // TODO: adicionar campo Categoria na tabela LivrosCatalogo
    const cats = new Set(
      this.todosLivros.map((l) => l.autorInfo?.NomeAutor || 'Sem categoria'),
    );
    this.categorias = Array.from(cats);
  }

  preencherColecoes(): void {
    const livros = this.todosLivros;
    this.fantasia = livros.slice(0, 8);
    this.programacao = livros.slice(8, 16);
    this.classicos = livros.slice(16, 24);
    this.ficcao = livros.slice(24, 32);
    this.suspense = livros.slice(32, 40);
    this.distopia = livros.slice(40, 48);
    this.historia = livros.slice(48, 56);
  }

  formatarStatus(status: string | undefined): string {
    if (!status) return 'INDISPONÍVEL';
    return status === 'DISPONIVEL' ? 'INSTOCK' : status.toUpperCase();
  }

  toggleFavorito(livro: Livro): void {
    livro.favorito = !livro.favorito;
  }

  adicionarCarrinho(livro: Livro): void {
    this.alert.info('Carrinho', `"${livro.Titulo}" adicionado ao carrinho`);
  }

  aplicarFiltro(): void {
    const txt = this.filtroTexto.toLowerCase();
    this.livrosFiltrados = this.todosLivros.filter((l) => {
      const bateTitulo = l.Titulo?.toLowerCase().includes(txt);
      const bateAutor = l.autorInfo?.NomeAutor?.toLowerCase().includes(txt);
      const bateTipo =
        this.filtroTipo === 'todos'
          ? true
          : this.filtroTipo === 'fisico'
            ? l.LivroFisico === 1
            : l.LivroDigital === 1;
      return (bateTitulo || bateAutor) && bateTipo;
    });
  }

  getLivrosPorAutor(nomeAutor: string): Livro[] {
    return this.livrosFiltrados.filter(
      (l) => l.autorInfo?.NomeAutor === nomeAutor,
    );
  }

  temLivrosNoGrupo(nomeAutor: string): boolean {
    return this.getLivrosPorAutor(nomeAutor).length > 0;
  }

  getStatusLabel(livro: Livro): string {
    if (!livro.QtdLivros || livro.QtdLivros <= 0) return 'Indisponível';
    return 'Disponível';
  }

  getSeverity(livro: Livro): 'success' | 'danger' | 'warning' {
    if (!livro.QtdLivros || livro.QtdLivros <= 0) return 'danger';
    if (livro.QtdLivros <= 2) return 'warning';
    return 'success';
  }

  getTipoBadge(livro: Livro): string {
    if (livro.LivroFisico && livro.LivroDigital) return 'Físico + Digital';
    if (livro.LivroDigital) return 'E-book';
    return 'Físico';
  }
}
