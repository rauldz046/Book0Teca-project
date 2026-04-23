import { Component, inject, OnInit } from '@angular/core';
import {
  Atividade,
  TipoAtividade,
  SeveridadeAtividade,
} from 'src/app/models/atividade.model';

type UserProfile =
  | 'LEITOR'
  | 'BIBLIOTECARIO'
  | 'FINANCEIRO'
  | 'ESTOQUE'
  | 'ADMINISTRADOR';

@Component({
  selector: 'app-atividade-usuarios',
  templateUrl: './atividade-usuarios.component.html',
  styleUrls: ['./atividade-usuarios.component.scss'],
})
export class AtividadeUsuariosComponent implements OnInit {
  // Usuario logado (mock — viria de um AuthService)
  // Troque o perfil pra ver o comportamento: LEITOR esconde a aba de auditoria
  usuarioLogadoId: number = 1;
  usuarioLogadoNome: string = 'Raul Cavalcante';
  perfilLogado: UserProfile = 'ADMINISTRADOR';

  // Dados
  atividades: Atividade[] = [];
  minhasAtividades: Atividade[] = [];
  auditoriaSistema: Atividade[] = [];

  // Filtros da aba de auditoria
  filtroTexto: string = '';
  filtroTipo: TipoAtividade | null = null;
  filtroPerfil: UserProfile | null = null;
  filtroDataInicio: Date | null = null;
  filtroDataFim: Date | null = null;

  tiposDisponiveis: { label: string; value: TipoAtividade }[] = [
    { label: 'Login', value: 'LOGIN' },
    { label: 'Logout', value: 'LOGOUT' },
    { label: 'Empréstimo', value: 'EMPRESTIMO' },
    { label: 'Devolução', value: 'DEVOLUCAO' },
    { label: 'Reserva', value: 'RESERVA' },
    { label: 'Multa Aplicada', value: 'MULTA_APLICADA' },
    { label: 'Multa Paga', value: 'MULTA_PAGA' },
    { label: 'Cadastro', value: 'CADASTRO' },
    { label: 'Edição', value: 'EDICAO' },
    { label: 'Exclusão', value: 'EXCLUSAO' },
    { label: 'Permissão Alterada', value: 'PERMISSAO_ALTERADA' },
  ];

  perfisDisponiveis: { label: string; value: UserProfile }[] = [
    { label: 'Leitor', value: 'LEITOR' },
    { label: 'Bibliotecário', value: 'BIBLIOTECARIO' },
    { label: 'Financeiro', value: 'FINANCEIRO' },
    { label: 'Estoque', value: 'ESTOQUE' },
    { label: 'Administrador', value: 'ADMINISTRADOR' },
  ];

  activeTabIndex: number = 0;

  ngOnInit(): void {
    this.carregarAtividades();
    this.aplicarFiltros();
  }

  carregarAtividades(): void {
    // Mock - viria do back-end (endpoint /auditoria ou /atividades)
    const agora = new Date();
    const hora = (h: number) => new Date(agora.getTime() - h * 60 * 60 * 1000);

    this.atividades = [
      {
        id: 1,
        usuarioId: 1,
        usuarioNome: 'Raul Cavalcante',
        perfilUsuario: 'ADMINISTRADOR',
        tipo: 'LOGIN',
        descricao: 'Login realizado com sucesso',
        ipOrigem: '192.168.0.12',
        severidade: 'SUCESSO',
        dataHora: hora(0.2),
      },
      {
        id: 2,
        usuarioId: 2,
        usuarioNome: 'João Silva',
        perfilUsuario: 'LEITOR',
        tipo: 'EMPRESTIMO',
        descricao: 'Realizou empréstimo do livro "Clean Code"',
        entidadeAfetada: 'livro:42',
        severidade: 'INFO',
        dataHora: hora(1),
      },
      {
        id: 3,
        usuarioId: 5,
        usuarioNome: 'Maria Souza',
        perfilUsuario: 'BIBLIOTECARIO',
        tipo: 'DEVOLUCAO',
        descricao: 'Confirmou devolução do livro "Dom Casmurro"',
        entidadeAfetada: 'emprestimo:128',
        severidade: 'SUCESSO',
        dataHora: hora(3),
      },
      {
        id: 4,
        usuarioId: 1,
        usuarioNome: 'Raul Cavalcante',
        perfilUsuario: 'ADMINISTRADOR',
        tipo: 'PERMISSAO_ALTERADA',
        descricao: 'Alterou permissões do perfil BIBLIOTECARIO',
        entidadeAfetada: 'perfil:2',
        severidade: 'AVISO',
        dataHora: hora(5),
      },
      {
        id: 5,
        usuarioId: 8,
        usuarioNome: 'Ana Paula',
        perfilUsuario: 'FINANCEIRO',
        tipo: 'MULTA_APLICADA',
        descricao: 'Aplicou multa de R$ 17,50 a Ricardo Lima',
        entidadeAfetada: 'multa:55',
        severidade: 'AVISO',
        dataHora: hora(8),
      },
      {
        id: 6,
        usuarioId: 2,
        usuarioNome: 'João Silva',
        perfilUsuario: 'LEITOR',
        tipo: 'RESERVA',
        descricao: 'Reservou o livro "O Senhor dos Anéis" (posição 2 na fila)',
        entidadeAfetada: 'reserva:89',
        severidade: 'INFO',
        dataHora: hora(12),
      },
      {
        id: 7,
        usuarioId: 1,
        usuarioNome: 'Raul Cavalcante',
        perfilUsuario: 'ADMINISTRADOR',
        tipo: 'EXCLUSAO',
        descricao: 'Desativou funcionário FUNC003 (soft delete)',
        entidadeAfetada: 'funcionario:3',
        severidade: 'ERRO',
        dataHora: hora(26),
      },
      {
        id: 8,
        usuarioId: 1,
        usuarioNome: 'Raul Cavalcante',
        perfilUsuario: 'ADMINISTRADOR',
        tipo: 'CADASTRO',
        descricao: 'Cadastrou novo livro "Pragmatic Programmer" no acervo',
        entidadeAfetada: 'livro:101',
        severidade: 'SUCESSO',
        dataHora: hora(30),
      },
    ];
  }

  aplicarFiltros(): void {
    // Minha atividade = so do usuario logado
    this.minhasAtividades = this.atividades
      .filter((a) => a.usuarioId === this.usuarioLogadoId)
      .sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

    // Auditoria = todas, respeitando filtros
    this.auditoriaSistema = this.atividades
      .filter((a) => {
        const txt = this.filtroTexto?.toLowerCase() ?? '';
        const bateTexto =
          !txt ||
          a.usuarioNome.toLowerCase().includes(txt) ||
          a.descricao.toLowerCase().includes(txt);

        const bateTipo = !this.filtroTipo || a.tipo === this.filtroTipo;
        const batePerfil =
          !this.filtroPerfil || a.perfilUsuario === this.filtroPerfil;

        const bateDataIni =
          !this.filtroDataInicio || a.dataHora >= this.filtroDataInicio;
        const bateDataFim =
          !this.filtroDataFim || a.dataHora <= this.filtroDataFim;

        return (
          bateTexto && bateTipo && batePerfil && bateDataIni && bateDataFim
        );
      })
      .sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
  }

  limparFiltros(): void {
    this.filtroTexto = '';
    this.filtroTipo = null;
    this.filtroPerfil = null;
    this.filtroDataInicio = null;
    this.filtroDataFim = null;
    this.aplicarFiltros();
  }

  // RBAC: so staff ve a aba de auditoria
  podeVerAuditoria(): boolean {
    return ['ADMINISTRADOR', 'BIBLIOTECARIO', 'FINANCEIRO'].includes(
      this.perfilLogado,
    );
  }

  iconePorTipo(tipo: TipoAtividade): string {
    const mapa: Record<TipoAtividade, string> = {
      LOGIN: 'pi pi-sign-in',
      LOGOUT: 'pi pi-sign-out',
      EMPRESTIMO: 'pi pi-book',
      DEVOLUCAO: 'pi pi-refresh',
      RESERVA: 'pi pi-bookmark',
      MULTA_APLICADA: 'pi pi-exclamation-triangle',
      MULTA_PAGA: 'pi pi-dollar',
      CADASTRO: 'pi pi-plus-circle',
      EDICAO: 'pi pi-pencil',
      EXCLUSAO: 'pi pi-trash',
      PERMISSAO_ALTERADA: 'pi pi-lock',
    };
    return mapa[tipo] ?? 'pi pi-circle';
  }

  corPorSeveridade(sev: SeveridadeAtividade): string {
    switch (sev) {
      case 'SUCESSO':
        return '#10b981';
      case 'INFO':
        return '#3b82f6';
      case 'AVISO':
        return '#f59e0b';
      case 'ERRO':
        return '#ef4444';
    }
  }

  getSeverityTag(
    sev: SeveridadeAtividade,
  ): 'success' | 'info' | 'warning' | 'danger' {
    switch (sev) {
      case 'SUCESSO':
        return 'success';
      case 'INFO':
        return 'info';
      case 'AVISO':
        return 'warning';
      case 'ERRO':
        return 'danger';
    }
  }

  exportarCsv(): void {
    // Placeholder — no back-end isso sera um endpoint retornando text/csv
    const linhas = [
      'ID;Data;Usuário;Perfil;Tipo;Descrição;Severidade',
      ...this.auditoriaSistema.map(
        (a) =>
          `${a.id};${a.dataHora.toISOString()};${a.usuarioNome};${a.perfilUsuario};${a.tipo};"${a.descricao}";${a.severidade}`,
      ),
    ].join('\n');

    const blob = new Blob([linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
