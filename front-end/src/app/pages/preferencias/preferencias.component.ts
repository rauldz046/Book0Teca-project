import { Component, OnInit, inject } from '@angular/core';
import { AlertService } from 'src/app/utils/toast-alert-service.service';

type AbaPref =
  | 'dados'
  | 'financeiro'
  | 'acessibilidade'
  | 'aparencia'
  | 'notificacoes';

interface DadosPessoais {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: Date | null;
}

interface DadosFinanceiros {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: 'corrente' | 'poupanca';
  chavePix: string;
}

interface Acessibilidade {
  tamanhoFonte: 'pequena' | 'media' | 'grande';
  altoContraste: boolean;
  reducaoMovimento: boolean;
  leitorTela: boolean;
}

interface Aparencia {
  tema: 'claro' | 'escuro' | 'sistema';
  corAcento: string;
}

interface Notificacoes {
  emailEmprestimos: boolean;
  emailMultas: boolean;
  emailPromocoes: boolean;
  pushNavegador: boolean;
  whatsapp: boolean;
  diasAntesVencimento: number;
}

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.scss'],
})
export class PreferenciasComponent implements OnInit {
  abaAtiva: AbaPref = 'dados';

  dadosPessoais: DadosPessoais = {
    nome: 'Raul Cavalcante',
    email: 'raul.7lmg@biblioteca.com.br',
    telefone: '(11) 98888-7777',
    cpf: '123.456.789-00',
    dataNascimento: new Date(1995, 2, 15),
  };

  dadosFinanceiros: DadosFinanceiros = {
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'corrente',
    chavePix: '',
  };

  acessibilidade: Acessibilidade = {
    tamanhoFonte: 'media',
    altoContraste: false,
    reducaoMovimento: false,
    leitorTela: false,
  };

  aparencia: Aparencia = {
    tema: 'claro',
    corAcento: '#10b981',
  };

  notificacoes: Notificacoes = {
    emailEmprestimos: true,
    emailMultas: true,
    emailPromocoes: false,
    pushNavegador: false,
    whatsapp: false,
    diasAntesVencimento: 3,
  };

  // Senha (troca rapida — nao fica salva junto com o resto)
  senhaAtual = '';
  senhaNova = '';
  senhaConfirmacao = '';

  // Opcoes de UI
  temasDisponiveis = [
    { label: 'Claro', value: 'claro', icon: 'pi pi-sun' },
    { label: 'Escuro', value: 'escuro', icon: 'pi pi-moon' },
    { label: 'Sistema', value: 'sistema', icon: 'pi pi-desktop' },
  ];

  coresDisponiveis = [
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#ef4444',
  ];

  tamanhosFonte = [
    { label: 'A', value: 'pequena' },
    { label: 'A', value: 'media' },
    { label: 'A', value: 'grande' },
  ];

  private alert = inject(AlertService);

  ngOnInit(): void {
    // TODO: Carregar preferencias do back-end via service
  }

  trocarAba(aba: AbaPref): void {
    this.abaAtiva = aba;
  }

  async salvarDadosPessoais(): Promise<void> {
    if (!this.dadosPessoais.nome || !this.dadosPessoais.email) {
      this.alert.error('Erro', 'Nome e e-mail são obrigatórios');
      return;
    }
    // TODO: chamar ClientesService.UpdateUsuario
    this.alert.success('Salvo', 'Dados pessoais atualizados');
  }

  async salvarDadosFinanceiros(): Promise<void> {
    // TODO: chamar service financeiro
    this.alert.success('Salvo', 'Dados financeiros atualizados');
  }

  salvarAcessibilidade(): void {
    // Aplica instantaneamente + persiste
    document.documentElement.dataset['fontSize'] =
      this.acessibilidade.tamanhoFonte;
    document.documentElement.dataset['contrast'] = this.acessibilidade
      .altoContraste
      ? 'high'
      : 'normal';
    this.alert.toastSuccess('Preferências de acessibilidade aplicadas');
  }

  salvarAparencia(): void {
    // Tema aplicado instantaneamente
    document.documentElement.dataset['theme'] = this.aparencia.tema;
    document.documentElement.style.setProperty(
      '--cor-acento',
      this.aparencia.corAcento,
    );
    this.alert.toastSuccess('Aparência atualizada');
  }

  salvarNotificacoes(): void {
    if (this.notificacoes.pushNavegador && 'Notification' in window) {
      Notification.requestPermission();
    }
    this.alert.success('Salvo', 'Preferências de notificação atualizadas');
  }

  async trocarSenha(): Promise<void> {
    if (!this.senhaAtual || !this.senhaNova) {
      this.alert.error('Erro', 'Preencha todos os campos de senha');
      return;
    }
    if (this.senhaNova.length < 6) {
      this.alert.error('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (this.senhaNova !== this.senhaConfirmacao) {
      this.alert.error('Erro', 'As senhas não coincidem');
      return;
    }

    const ok = await this.alert.confirm(
      'Confirmar troca',
      'Você será desconectado de outras sessões. Continuar?',
    );
    if (!ok) return;

    // TODO: ClientesService.UpdateSenhaUsuario
    this.alert.success('Senha trocada', 'Use a nova senha no próximo login');
    this.senhaAtual = '';
    this.senhaNova = '';
    this.senhaConfirmacao = '';
  }
}
