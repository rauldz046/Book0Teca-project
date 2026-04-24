import { Component, OnInit } from '@angular/core';
import { Transacao } from '../../models/transacao.model';

type FiltroTipo = 'TODOS' | 'ENTRADA' | 'SAIDA';

@Component({
  selector: 'app-gerenciamento-financeiro',
  templateUrl: './gerenciamento-financeiro.component.html',
  styleUrls: ['./gerenciamento-financeiro.component.scss'],
})
export class GerenciamentoFinanceiroComponent implements OnInit {
  transacoes: Transacao[] = [];
  transacoesFiltradas: Transacao[] = [];

  chartData: any;
  chartOptions: any;

  totalEntradas = 0;
  totalSaidas = 0;
  saldoGeral = 0;
  qtdTransacoes = 0;
  ticketMedio = 0;
  qtdPendentes = 0;

  filtroTexto = '';
  filtroTipo: FiltroTipo = 'TODOS';

  ngOnInit() {
    this.gerarDadosSimulados();
    this.aplicarFiltros();
    this.recalcularKpis();
    this.initChart();
  }

  gerarDadosSimulados() {
    this.transacoes = [
      { id: 1, data: new Date(2023, 10, 1),  descricao: 'Multa: Atraso "Dom Casmurro"',        categoria: 'MULTA',      tipo: 'ENTRADA', valor: 12.5,  metodoPagamento: 'PIX',           status: 'CONCLUIDO' },
      { id: 2, data: new Date(2023, 10, 2),  descricao: 'Compra: 10x Livros Ficção Científica', categoria: 'AQUISIÇÃO',  tipo: 'SAIDA',   valor: 450.0, metodoPagamento: 'TRANSFERÊNCIA', status: 'CONCLUIDO' },
      { id: 3, data: new Date(2023, 10, 5),  descricao: 'Reparo de Capas Danificadas',          categoria: 'MANUTENÇÃO', tipo: 'SAIDA',   valor: 85.0,  metodoPagamento: 'DINHEIRO',      status: 'CONCLUIDO' },
      { id: 4, data: new Date(2023, 10, 10), descricao: 'Assinatura Software Gestão',           categoria: 'ASSINATURA', tipo: 'SAIDA',   valor: 199.9, metodoPagamento: 'CARTÃO',        status: 'PENDENTE' },
      { id: 5, data: new Date(2023, 10, 12), descricao: 'Multa: Livro Extraviado "Clean Code"', categoria: 'MULTA',      tipo: 'ENTRADA', valor: 110.0, metodoPagamento: 'BOLETO',        status: 'CONCLUIDO' },
      { id: 6, data: new Date(2023, 10, 15), descricao: 'Doação Cultural Identificada',         categoria: 'OUTROS',     tipo: 'ENTRADA', valor: 500.0, metodoPagamento: 'PIX',           status: 'CONCLUIDO' },
    ];
  }

  // ─── filtros e KPIs ──────────────────────────────────────────────────
  aplicarFiltros() {
    const txt = this.filtroTexto.trim().toLowerCase();
    this.transacoesFiltradas = this.transacoes.filter((t) => {
      const bateTexto =
        !txt ||
        t.descricao.toLowerCase().includes(txt) ||
        t.categoria.toLowerCase().includes(txt) ||
        t.metodoPagamento.toLowerCase().includes(txt);
      const bateTipo = this.filtroTipo === 'TODOS' || t.tipo === this.filtroTipo;
      return bateTexto && bateTipo;
    });
  }

  limparFiltros() {
    this.filtroTexto = '';
    this.filtroTipo = 'TODOS';
    this.aplicarFiltros();
  }

  recalcularKpis() {
    this.totalEntradas = this.transacoes
      .filter((t) => t.tipo === 'ENTRADA' && t.status === 'CONCLUIDO')
      .reduce((acc, t) => acc + t.valor, 0);

    this.totalSaidas = this.transacoes
      .filter((t) => t.tipo === 'SAIDA' && t.status === 'CONCLUIDO')
      .reduce((acc, t) => acc + t.valor, 0);

    this.saldoGeral = this.totalEntradas - this.totalSaidas;
    this.qtdTransacoes = this.transacoes.length;
    this.qtdPendentes = this.transacoes.filter((t) => t.status === 'PENDENTE').length;
    this.ticketMedio =
      this.qtdTransacoes > 0
        ? (this.totalEntradas + this.totalSaidas) / this.qtdTransacoes
        : 0;
  }

  // ─── chart ───────────────────────────────────────────────────────────
  initChart() {
    this.chartData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Entradas',
          backgroundColor: '#22c55e',
          borderRadius: 6,
          data: [400, 300, 600, 800],
        },
        {
          label: 'Saídas',
          backgroundColor: '#ef4444',
          borderRadius: 6,
          data: [200, 450, 100, 300],
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#475569', font: { weight: 600 } },
          position: 'bottom',
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b' } },
        y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
      },
    };
  }

  // ─── helpers ─────────────────────────────────────────────────────────
  getSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'CONCLUIDO': return 'success';
      case 'PENDENTE':  return 'warning';
      case 'ESTORNADO': return 'danger';
      default:          return 'info';
    }
  }

  getCategoriaCor(categoria: string): string {
    switch (categoria) {
      case 'MULTA':       return 'cat-multa';
      case 'AQUISIÇÃO':   return 'cat-aquisicao';
      case 'MANUTENÇÃO':  return 'cat-manutencao';
      case 'ASSINATURA':  return 'cat-assinatura';
      case 'OUTROS':      return 'cat-outros';
      default:            return 'cat-outros';
    }
  }

  getIconeMetodo(metodo: string): string {
    switch (metodo) {
      case 'PIX':            return 'pi pi-bolt';
      case 'BOLETO':         return 'pi pi-file';
      case 'CARTÃO':         return 'pi pi-credit-card';
      case 'DINHEIRO':       return 'pi pi-money-bill';
      case 'TRANSFERÊNCIA':  return 'pi pi-send';
      default:               return 'pi pi-wallet';
    }
  }
}
