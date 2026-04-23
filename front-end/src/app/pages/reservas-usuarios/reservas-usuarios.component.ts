import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { Reserva, TipoReserva } from 'src/app/models/reservas.model';

@Component({
  selector: 'app-reservas-usuarios',
  templateUrl: './reservas-usuarios.component.html',
  styleUrls: ['./reservas-usuarios.component.scss'],
})
export class ReservasUsuariosComponent implements OnInit {
  reservas: Reserva[] = [];
  reservaDialog: boolean = false;
  submitted: boolean = false;

  // Dois modos de reserva (definido no escopo)
  tiposReserva = [
    { label: 'Fila de Espera (livro indisponível)', value: 'FILA_ESPERA' },
    { label: 'Agendar Retirada (livro disponível)', value: 'AGENDAMENTO' },
  ];

  novaReserva: any = {
    usuario: null,
    livro: null,
    tipo: 'FILA_ESPERA' as TipoReserva,
    dataAgendada: null,
  };

  // Mock — viriam de services
  usuarios: any[] = [];
  livros: any[] = [];

  // Prazo padrao (em dias) pra retirar um livro depois que a reserva ficar DISPONIVEL
  PRAZO_RETIRADA_DIAS = 2;

  // Usado no [minDate] do p-calendar (nao permite agendar no passado)
  hoje: Date = new Date();

  private alert = inject(AlertService);

  ngOnInit(): void {
    this.carregarDadosIniciais();

    this.usuarios = [
      { id: 1, nome: 'João Silva', matricula: '2023001' },
      { id: 2, nome: 'Maria Souza', matricula: '2023002' },
      { id: 3, nome: 'Ricardo Lima', matricula: '2023003' },
    ];

    this.livros = [
      { id: 1, titulo: 'O Senhor dos Anéis', disponivel: false },
      { id: 2, titulo: 'Angular Pro', disponivel: true },
      { id: 3, titulo: 'Clean Code', disponivel: false },
      { id: 4, titulo: 'Dom Casmurro', disponivel: true },
    ];
  }

  carregarDadosIniciais(): void {
    // Mock — simula dados vindo da API
    const hoje = new Date();
    this.reservas = [
      {
        id: 1,
        livroId: 1,
        livroTitulo: 'O Senhor dos Anéis',
        usuarioId: 1,
        usuarioNome: 'João Silva',
        matricula: '2023001',
        tipo: 'FILA_ESPERA',
        posicaoFila: 1,
        dataSolicitacao: new Date(hoje.getTime() - 3 * 24 * 60 * 60 * 1000),
        status: 'AGUARDANDO',
      },
      {
        id: 2,
        livroId: 1,
        livroTitulo: 'O Senhor dos Anéis',
        usuarioId: 2,
        usuarioNome: 'Maria Souza',
        matricula: '2023002',
        tipo: 'FILA_ESPERA',
        posicaoFila: 2,
        dataSolicitacao: new Date(hoje.getTime() - 1 * 24 * 60 * 60 * 1000),
        status: 'AGUARDANDO',
      },
      {
        id: 3,
        livroId: 2,
        livroTitulo: 'Angular Pro',
        usuarioId: 3,
        usuarioNome: 'Ricardo Lima',
        matricula: '2023003',
        tipo: 'AGENDAMENTO',
        dataSolicitacao: new Date(),
        dataAgendada: new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000),
        dataLimiteRetirada: new Date(hoje.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'DISPONIVEL',
      },
    ];
  }

  abrirNovo(): void {
    this.novaReserva = {
      usuario: null,
      livro: null,
      tipo: 'FILA_ESPERA',
      dataAgendada: null,
    };
    this.submitted = false;
    this.reservaDialog = true;
  }

  fecharDialog(): void {
    this.reservaDialog = false;
    this.submitted = false;
  }

  // Quando o usuario troca o tipo, resetamos a data agendada
  onTipoChange(): void {
    this.novaReserva.dataAgendada = null;
  }

  // Auto-seleção do tipo baseada na disponibilidade do livro (sugestão, editável)
  onLivroChange(): void {
    if (!this.novaReserva.livro) return;
    this.novaReserva.tipo = this.novaReserva.livro.disponivel
      ? 'AGENDAMENTO'
      : 'FILA_ESPERA';
  }

  salvarReserva(): void {
    this.submitted = true;

    if (!this.novaReserva.usuario || !this.novaReserva.livro) {
      this.alert.error('Erro', 'Selecione usuário e livro');
      return;
    }

    if (
      this.novaReserva.tipo === 'AGENDAMENTO' &&
      !this.novaReserva.dataAgendada
    ) {
      this.alert.error('Erro', 'Informe a data de retirada agendada');
      return;
    }

    // Regra: se for AGENDAMENTO mas o livro estiver indisponivel, forca fila
    if (
      this.novaReserva.tipo === 'AGENDAMENTO' &&
      !this.novaReserva.livro.disponivel
    ) {
      this.alert.toastWarning(
        'Livro indisponível — reserva convertida para fila de espera',
      );
      this.novaReserva.tipo = 'FILA_ESPERA';
      this.novaReserva.dataAgendada = null;
    }

    const hoje = new Date();
    const nova: Reserva = {
      id: Math.floor(Math.random() * 100000),
      livroId: this.novaReserva.livro.id,
      livroTitulo: this.novaReserva.livro.titulo,
      usuarioId: this.novaReserva.usuario.id,
      usuarioNome: this.novaReserva.usuario.nome,
      matricula: this.novaReserva.usuario.matricula,
      tipo: this.novaReserva.tipo,
      dataSolicitacao: hoje,
      status:
        this.novaReserva.tipo === 'AGENDAMENTO' ? 'DISPONIVEL' : 'AGUARDANDO',
      posicaoFila:
        this.novaReserva.tipo === 'FILA_ESPERA'
          ? this.calcularPosicaoFila(this.novaReserva.livro.id)
          : undefined,
      dataAgendada:
        this.novaReserva.tipo === 'AGENDAMENTO'
          ? this.novaReserva.dataAgendada
          : undefined,
      dataLimiteRetirada:
        this.novaReserva.tipo === 'AGENDAMENTO'
          ? this.calcularPrazoRetirada(this.novaReserva.dataAgendada)
          : undefined,
    };

    this.reservas.push(nova);
    this.alert.success('Sucesso', 'Reserva registrada com sucesso');
    this.reservaDialog = false;
  }

  private calcularPosicaoFila(livroId: number): number {
    const emFila = this.reservas.filter(
      (r) =>
        r.livroId === livroId &&
        r.tipo === 'FILA_ESPERA' &&
        r.status === 'AGUARDANDO',
    );
    return emFila.length + 1;
  }

  private calcularPrazoRetirada(dataBase: Date): Date {
    const d = new Date(dataBase);
    d.setDate(d.getDate() + this.PRAZO_RETIRADA_DIAS);
    return d;
  }

  async cancelarReserva(reserva: Reserva): Promise<void> {
    const ok = await this.alert.confirm(
      'Cancelar Reserva',
      `Confirma o cancelamento da reserva de "${reserva.livroTitulo}"?`,
    );
    if (!ok) return;

    reserva.status = 'CANCELADO';
    this.reorganizarFila(reserva.livroId);
    this.alert.success('Cancelada', 'Reserva cancelada com sucesso');
  }

  async converterEmEmprestimo(reserva: Reserva): Promise<void> {
    if (reserva.status !== 'DISPONIVEL') {
      this.alert.error(
        'Ação inválida',
        'Só é possível efetivar reservas com status DISPONÍVEL',
      );
      return;
    }

    const ok = await this.alert.confirm(
      'Efetivar Retirada',
      `Confirmar a retirada do livro por ${reserva.usuarioNome}?`,
    );
    if (!ok) return;

    reserva.status = 'RETIRADO';
    this.alert.success('OK', 'Retirada registrada — empréstimo aberto');
  }

  // Ao cancelar/retirar, os da fila sobem de posicao
  private reorganizarFila(livroId: number): void {
    const fila = this.reservas
      .filter(
        (r) =>
          r.livroId === livroId &&
          r.tipo === 'FILA_ESPERA' &&
          r.status === 'AGUARDANDO',
      )
      .sort(
        (a, b) => a.dataSolicitacao.getTime() - b.dataSolicitacao.getTime(),
      );

    fila.forEach((r, idx) => (r.posicaoFila = idx + 1));
  }

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case 'DISPONIVEL':
        return 'success';
      case 'AGUARDANDO':
        return 'info';
      case 'RETIRADO':
        return 'success';
      case 'CANCELADO':
        return 'warning';
      case 'EXPIRADO':
        return 'danger';
      default:
        return 'info';
    }
  }

  getTipoLabel(tipo: TipoReserva): string {
    return tipo === 'FILA_ESPERA' ? 'Fila de Espera' : 'Agendamento';
  }
}
