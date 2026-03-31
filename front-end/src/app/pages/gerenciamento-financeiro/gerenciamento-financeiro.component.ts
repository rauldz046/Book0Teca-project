import { Component } from '@angular/core';
import { Transacao } from '../../models/transacao.model';

@Component({
  selector: 'app-gerenciamento-financeiro',
  templateUrl: './gerenciamento-financeiro.component.html',
  styleUrls: ['./gerenciamento-financeiro.component.scss'],
})
export class GerenciamentoFinanceiroComponent {
  transacoes: Transacao[] = [];
  chartData: any;
  chartOptions: any;

  totalEntradas: number = 0;
  totalSaidas: number = 0;
  saldoGeral: number = 0;

  ngOnInit() {
    this.gerarDadosSimulados();
    this.calcularTotais();
    this.initChart();
  }

  gerarDadosSimulados() {
    this.transacoes = [
      {
        id: 1,
        data: new Date(2023, 10, 1),
        descricao: 'Multa: Atraso "Dom Casmurro"',
        categoria: 'MULTA',
        tipo: 'ENTRADA',
        valor: 12.5,
        metodoPagamento: 'PIX',
        status: 'CONCLUIDO',
      },
      {
        id: 2,
        data: new Date(2023, 10, 2),
        descricao: 'Compra: 10x Livros Ficção Científica',
        categoria: 'AQUISIÇÃO',
        tipo: 'SAIDA',
        valor: 450.0,
        metodoPagamento: 'TRANSFERÊNCIA',
        status: 'CONCLUIDO',
      },
      {
        id: 3,
        data: new Date(2023, 10, 5),
        descricao: 'Reparo de Capas Danificadas',
        categoria: 'MANUTENÇÃO',
        tipo: 'SAIDA',
        valor: 85.0,
        metodoPagamento: 'DINHEIRO',
        status: 'CONCLUIDO',
      },
      {
        id: 4,
        data: new Date(2023, 10, 10),
        descricao: 'Assinatura Software Gestão',
        categoria: 'ASSINATURA',
        tipo: 'SAIDA',
        valor: 199.9,
        metodoPagamento: 'CARTÃO',
        status: 'PENDENTE',
      },
      {
        id: 5,
        data: new Date(2023, 10, 12),
        descricao: 'Multa: Livro Extraviado "Clean Code"',
        categoria: 'MULTA',
        tipo: 'ENTRADA',
        valor: 110.0,
        metodoPagamento: 'BOLETO',
        status: 'CONCLUIDO',
      },
      {
        id: 6,
        data: new Date(2023, 10, 15),
        descricao: 'Doação Cultural Identificada',
        categoria: 'OUTROS',
        tipo: 'ENTRADA',
        valor: 500.0,
        metodoPagamento: 'PIX',
        status: 'CONCLUIDO',
      },
    ];
  }

  calcularTotais() {
    this.totalEntradas = this.transacoes
      .filter((t) => t.tipo === 'ENTRADA')
      .reduce((acc, curr) => acc + curr.valor, 0);
    this.totalSaidas = this.transacoes
      .filter((t) => t.tipo === 'SAIDA')
      .reduce((acc, curr) => acc + curr.valor, 0);
    this.saldoGeral = this.totalEntradas - this.totalSaidas;
  }

  initChart() {
    this.chartData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Entradas',
          backgroundColor: '#4ade80',
          data: [400, 300, 600, 800],
        },
        {
          label: 'Saídas',
          backgroundColor: '#f87171',
          data: [200, 450, 100, 300],
        },
      ],
    };

    this.chartOptions = {
      plugins: { legend: { labels: { color: '#495057' } } },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, grid: { color: '#ebedef' } },
      },
    };
  }

  getSeverity(status: string) {
    switch (status) {
      case 'CONCLUIDO':
        return 'success';
      case 'PENDENTE':
        return 'warning';
      case 'ESTORNADO':
        return 'danger';
      default:
        return 'info';
    }
  }
}
