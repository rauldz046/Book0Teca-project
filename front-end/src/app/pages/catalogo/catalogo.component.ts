import { Component, OnInit, inject } from '@angular/core';
import { LivrosService } from 'src/app/services/Livros.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { Livro } from 'src/app/models/livros.model';

interface Colecao {
  titulo: string;
  subtitulo: string;
  livros: Livro[];
}

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
  colecoes: Colecao[] = [];
  loading = true;

  filtroTexto = '';
  filtroTipo: 'todos' | 'fisico' | 'digital' = 'todos';

  readonly CAPA_PLACEHOLDER =
    'https://via.placeholder.com/180x260/e2e8f0/64748b?text=Sem+Capa';

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
        this.todosLivros = res || [];
        this.livrosFiltrados = [...this.todosLivros];
        this.montarColecoes();
        this.loading = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar catálogo de livros');
        this.loading = false;
      },
    });
  }

  /** Monta coleções agrupando por autor (fallback enquanto não há campo Categoria). */
  montarColecoes(): void {
    const porAutor = new Map<string, Livro[]>();

    for (const livro of this.livrosFiltrados) {
      const autor = livro.autorInfo?.NomeAutor || 'Outros títulos';
      if (!porAutor.has(autor)) porAutor.set(autor, []);
      porAutor.get(autor)!.push(livro);
    }

    this.colecoes = Array.from(porAutor.entries())
      .filter(([, livros]) => livros.length > 0)
      .map(([autor, livros]) => ({
        titulo: autor,
        subtitulo: `${livros.length} ${livros.length === 1 ? 'obra' : 'obras'} disponíveis`,
        livros,
      }));
  }

  aplicarFiltro(): void {
    const txt = this.filtroTexto.trim().toLowerCase();

    this.livrosFiltrados = this.todosLivros.filter((l) => {
      const bateTexto =
        !txt ||
        l.Titulo?.toLowerCase().includes(txt) ||
        l.autorInfo?.NomeAutor?.toLowerCase().includes(txt) ||
        l.ISBN?.toLowerCase().includes(txt);

      const bateTipo =
        this.filtroTipo === 'todos'
          ? true
          : this.filtroTipo === 'fisico'
            ? l.LivroFisico === 1
            : l.LivroDigital === 1;

      return bateTexto && bateTipo;
    });

    this.montarColecoes();
  }

  limparFiltros(): void {
    this.filtroTexto = '';
    this.filtroTipo = 'todos';
    this.aplicarFiltro();
  }

  // ─── helpers de apresentação ─────────────────────────────────────────

  getCapa(livro: Livro): string {
    return livro.capa || livro.Capa || this.CAPA_PLACEHOLDER;
  }

  getPreco(livro: Livro): number {
    return livro.PrecoVenda || 0;
  }

  getStatusLabel(livro: Livro): string {
    if (!livro.QtdLivros || livro.QtdLivros <= 0) return 'Indisponível';
    if (livro.QtdLivros <= 2) return 'Últimas unidades';
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

  toggleFavorito(livro: Livro): void {
    livro.favorito = !livro.favorito;
  }

  /** Fallback caso a URL da capa (Open Library, etc.) não retorne imagem. */
  onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.CAPA_PLACEHOLDER) {
      img.src = this.CAPA_PLACEHOLDER;
    }
  }

  adicionarCarrinho(livro: Livro): void {
    if (!livro.QtdLivros && !livro.LivroDigital) {
      this.alert.error('Indisponível', `"${livro.Titulo}" está sem estoque.`);
      return;
    }
    this.alert.info('Carrinho', `"${livro.Titulo}" adicionado ao carrinho`);
  }
}
