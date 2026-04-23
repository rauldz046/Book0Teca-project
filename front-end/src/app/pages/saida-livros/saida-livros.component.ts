import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

interface SaidaLivro {
  livro: string;
  isbn: string;
  data: Date;
  motivo: string;
  responsavel: string;
  valorEstimado?: number;
}

@Component({
  selector: 'app-saida-livros',
  templateUrl: './saida-livros.component.html',
  styleUrls: ['./saida-livros.component.scss'],
})
export class SaidaLivrosComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  saidas: SaidaLivro[] = [
    {
      livro: 'Java How to Program',
      isbn: '978-01347',
      data: new Date('2024-04-01'),
      motivo: 'Dano Físico',
      responsavel: 'Carlos Almoxarife',
      valorEstimado: 85.9,
    },
    {
      livro: 'Design Patterns',
      isbn: '978-02016',
      data: new Date('2024-04-03'),
      motivo: 'Extravio',
      responsavel: 'Carlos Almoxarife',
      valorEstimado: 120.5,
    },
    {
      livro: 'Clean Code',
      isbn: '978-01323',
      data: new Date('2024-04-05'),
      motivo: 'Dano Físico',
      responsavel: 'Ana Bibliotecária',
      valorEstimado: 95.0,
    },
    {
      livro: 'The Pragmatic Programmer',
      isbn: '978-02016',
      data: new Date('2024-04-07'),
      motivo: 'Obsoleto',
      responsavel: 'Carlos Almoxarife',
      valorEstimado: 110.0,
    },
    {
      livro: 'Refactoring',
      isbn: '978-02014',
      data: new Date('2024-04-10'),
      motivo: 'Dano Físico',
      responsavel: 'Ana Bibliotecária',
      valorEstimado: 88.75,
    },
    {
      livro: 'Head First Design Patterns',
      isbn: '978-05960',
      data: new Date('2024-04-12'),
      motivo: 'Extravio',
      responsavel: 'Carlos Almoxarife',
      valorEstimado: 135.2,
    },
    {
      livro: 'Code Complete',
      isbn: '978-07356',
      data: new Date('2024-04-15'),
      motivo: 'Dano Físico',
      responsavel: 'Ana Bibliotecária',
      valorEstimado: 140.0,
    },
    {
      livro: 'Introduction to Algorithms',
      isbn: '978-02620',
      data: new Date('2024-04-18'),
      motivo: 'Obsoleto',
      responsavel: 'Carlos Almoxarife',
      valorEstimado: 200.0,
    },
    {
      livro: 'The Clean Coder',
      isbn: '978-01370',
      data: new Date('2024-04-20'),
      motivo: 'Dano Físico',
      responsavel: 'Ana Bibliotecária',
      valorEstimado: 92.3,
    },
    {
      livro: 'Effective Java',
      isbn: '978-03213',
      data: new Date('2024-04-22'),
      motivo: 'Extravio',
      responsavel: 'Carlos Almoxarife',
      valorEstimado: 125.8,
    },
  ];

  // Filtros e seleção
  periodoSelecionado: Date[] = [];
  motivoSelecionado: string = '';
  responsavelSelecionado: string = '';
  saidasSelecionadas: SaidaLivro[] = [];

  // Opções para dropdowns
  motivosOpcoes = [
    { label: 'Todos os motivos', value: '' },
    { label: 'Dano Físico', value: 'Dano Físico' },
    { label: 'Extravio', value: 'Extravio' },
    { label: 'Obsoleto', value: 'Obsoleto' },
  ];

  responsaveisOpcoes = [
    { label: 'Todos os responsáveis', value: '' },
    { label: 'Carlos Almoxarife', value: 'Carlos Almoxarife' },
    { label: 'Ana Bibliotecária', value: 'Ana Bibliotecária' },
  ];
  get totalBaixasMes(): number {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    return this.saidas.filter(
      (s) =>
        s.data.getMonth() === mesAtual && s.data.getFullYear() === anoAtual,
    ).length;
  }

  get valorTotalPerdido(): number {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();
    return this.saidas
      .filter(
        (s) =>
          s.data.getMonth() === mesAtual && s.data.getFullYear() === anoAtual,
      )
      .reduce((total, s) => total + (s.valorEstimado || 0), 0);
  }

  get motivoMaisComum(): string {
    const motivos = this.saidas.map((s) => s.motivo);
    const contagem = motivos.reduce(
      (acc, motivo) => {
        acc[motivo] = (acc[motivo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(contagem).sort(([, a], [, b]) => b - a)[0][0];
  }

  get motivosData(): {
    motivo: string;
    quantidade: number;
    percentual: number;
  }[] {
    const total = this.saidas.length;
    const contagem = this.saidas.reduce(
      (acc, s) => {
        acc[s.motivo] = (acc[s.motivo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(contagem)
      .map(([motivo, quantidade]) => ({
        motivo,
        quantidade,
        percentual: Math.round((quantidade / total) * 100),
      }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  getMotivoSeverity(motivo: string): string {
    switch (motivo) {
      case 'Dano Físico':
        return 'warning';
      case 'Extravio':
        return 'danger';
      case 'Obsoleto':
        return 'info';
      default:
        return 'secondary';
    }
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  ngOnInit() {}
}
