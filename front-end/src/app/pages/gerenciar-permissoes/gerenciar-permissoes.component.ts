import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import {
  Perfil,
  Permissao,
  AcaoPermissao,
  UserProfile,
} from 'src/app/models/permissoes.model';

@Component({
  selector: 'app-gerenciar-permissoes',
  templateUrl: './gerenciar-permissoes.component.html',
  styleUrls: ['./gerenciar-permissoes.component.scss'],
})
export class GerenciarPermissoesComponent implements OnInit {
  perfis: Perfil[] = [];
  permissoesDisponiveis: Permissao[] = [];

  // Perfil selecionado pra edicao (matriz lateral)
  perfilSelecionado: Perfil | null = null;

  // Agrupamento de permissoes por categoria pra renderizar em sessoes
  permissoesPorCategoria: Record<string, Permissao[]> = {};

  private alert = inject(AlertService);

  ngOnInit(): void {
    this.carregarPermissoesDisponiveis();
    this.carregarPerfis();
    this.agruparPorCategoria();
    // Seleciona o primeiro por padrao
    if (this.perfis.length > 0) this.selecionarPerfil(this.perfis[0]);
  }

  carregarPermissoesDisponiveis(): void {
    this.permissoesDisponiveis = [
      {
        acao: 'USUARIOS_GERENCIAR',
        label: 'Gerenciar leitores',
        categoria: 'Usuários',
      },
      {
        acao: 'FUNCIONARIOS_GERENCIAR',
        label: 'Gerenciar funcionários',
        categoria: 'Usuários',
      },
      {
        acao: 'ACERVO_VISUALIZAR',
        label: 'Visualizar catálogo',
        categoria: 'Acervo',
      },
      {
        acao: 'ACERVO_CADASTRAR',
        label: 'Cadastrar/editar livros',
        categoria: 'Acervo',
      },
      {
        acao: 'EMPRESTIMOS_REGISTRAR',
        label: 'Registrar empréstimos',
        categoria: 'Empréstimos',
      },
      {
        acao: 'DEVOLUCOES_CONFIRMAR',
        label: 'Confirmar devoluções',
        categoria: 'Empréstimos',
      },
      {
        acao: 'RESERVAS_GERENCIAR',
        label: 'Gerenciar reservas',
        categoria: 'Empréstimos',
      },
      {
        acao: 'MULTAS_APLICAR',
        label: 'Aplicar multas',
        categoria: 'Financeiro',
      },
      {
        acao: 'FINANCEIRO_BAIXAR_BOLETO',
        label: 'Dar baixa em boletos',
        categoria: 'Financeiro',
      },
      {
        acao: 'RELATORIOS_VISUALIZAR',
        label: 'Visualizar relatórios',
        categoria: 'Relatórios',
      },
      {
        acao: 'SISTEMA_CONFIGURAR',
        label: 'Configurar sistema',
        categoria: 'Sistema',
      },
    ];
  }

  carregarPerfis(): void {
    // Mock — no back isso vira findAll com JOIN nas permissoes
    this.perfis = [
      {
        id: 1,
        nome: 'ADMINISTRADOR',
        descricao: 'Acesso total ao sistema. Perfil protegido.',
        totalUsuarios: 2,
        editavel: false, // nao pode editar as permissoes do admin por seguranca
        permissoes: this.permissoesDisponiveis.map((p) => p.acao),
      },
      {
        id: 2,
        nome: 'BIBLIOTECARIO',
        descricao: 'Gestão do acervo, empréstimos e devoluções.',
        totalUsuarios: 5,
        editavel: true,
        permissoes: [
          'USUARIOS_GERENCIAR',
          'ACERVO_VISUALIZAR',
          'ACERVO_CADASTRAR',
          'EMPRESTIMOS_REGISTRAR',
          'DEVOLUCOES_CONFIRMAR',
          'RESERVAS_GERENCIAR',
          'MULTAS_APLICAR',
          'RELATORIOS_VISUALIZAR',
        ],
      },
      {
        id: 3,
        nome: 'FINANCEIRO',
        descricao: 'Módulo financeiro — boletos, multas e relatórios.',
        totalUsuarios: 2,
        editavel: true,
        permissoes: [
          'MULTAS_APLICAR',
          'FINANCEIRO_BAIXAR_BOLETO',
          'RELATORIOS_VISUALIZAR',
        ],
      },
      {
        id: 4,
        nome: 'ESTOQUE',
        descricao: 'Controle de estoque e patrimônio.',
        totalUsuarios: 3,
        editavel: true,
        permissoes: [
          'ACERVO_VISUALIZAR',
          'ACERVO_CADASTRAR',
          'RELATORIOS_VISUALIZAR',
        ],
      },
      {
        id: 5,
        nome: 'LEITOR',
        descricao: 'Usuário final — consulta e solicita empréstimos.',
        totalUsuarios: 142,
        editavel: true,
        permissoes: ['ACERVO_VISUALIZAR'],
      },
    ];
  }

  agruparPorCategoria(): void {
    this.permissoesPorCategoria = this.permissoesDisponiveis.reduce(
      (acc, p) => {
        (acc[p.categoria] ||= []).push(p);
        return acc;
      },
      {} as Record<string, Permissao[]>,
    );
  }

  get categorias(): string[] {
    return Object.keys(this.permissoesPorCategoria);
  }

  selecionarPerfil(perfil: Perfil): void {
    // Clonar pra nao editar em tempo real sem confirmar
    this.perfilSelecionado = JSON.parse(JSON.stringify(perfil));
    if (this.perfilSelecionado) {
      this.perfilSelecionado.permissoes = [...perfil.permissoes];
    }
  }

  temPermissao(acao: AcaoPermissao): boolean {
    return this.perfilSelecionado?.permissoes.includes(acao) ?? false;
  }

  togglePermissao(acao: AcaoPermissao): void {
    if (!this.perfilSelecionado || !this.perfilSelecionado.editavel) return;

    const idx = this.perfilSelecionado.permissoes.indexOf(acao);
    if (idx >= 0) {
      this.perfilSelecionado.permissoes.splice(idx, 1);
    } else {
      this.perfilSelecionado.permissoes.push(acao);
    }
  }

  async salvarAlteracoes(): Promise<void> {
    if (!this.perfilSelecionado) return;

    const ok = await this.alert.confirm(
      'Confirmar alterações',
      `Salvar as permissões do perfil ${this.perfilSelecionado.nome}? Isso afetará ${this.perfilSelecionado.totalUsuarios} usuário(s).`,
    );
    if (!ok) return;

    // Persiste no array principal
    const original = this.perfis.find(
      (p) => p.id === this.perfilSelecionado!.id,
    );
    if (original) {
      original.permissoes = [...this.perfilSelecionado.permissoes];
    }

    this.alert.success('Salvo', 'Permissões atualizadas com sucesso');
  }

  descartar(): void {
    if (!this.perfilSelecionado) return;
    const original = this.perfis.find(
      (p) => p.id === this.perfilSelecionado!.id,
    );
    if (original) this.selecionarPerfil(original);
  }

  corPorPerfil(nome: UserProfile): string {
    switch (nome) {
      case 'ADMINISTRADOR':
        return '#dc2626';
      case 'BIBLIOTECARIO':
        return '#2563eb';
      case 'FINANCEIRO':
        return '#16a34a';
      case 'ESTOQUE':
        return '#ea580c';
      case 'LEITOR':
        return '#6b7280';
    }
  }
}
