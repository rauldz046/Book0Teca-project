import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserProfile } from 'src/app/services/auth.service';
import { ClientesService } from 'src/app/services/Clientes.service';
import { FuncionariosService } from 'src/app/services/Funcionarios.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';

type TabName = 'dados' | 'seguranca' | 'preferencias' | 'atividade';

interface ViewUser {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  matricula?: string;
  regiao?: string;
  role: UserProfile;
  avatar: string;
  membroDesde: string;
  status: number;
  isFuncionario: boolean;
}

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.component.html',
  styleUrls: ['./user-perfil.component.scss'],
})
export class UserPerfilComponent implements OnInit {
  activeTab: TabName = 'dados';

  private auth = inject(AuthService);
  private clienteService = inject(ClientesService);
  private funcionarioService = inject(FuncionariosService);
  private alert = inject(AlertService);

  user!: ViewUser;
  sessionRaw: any = null;

  savingProfile = false;
  savingPassword = false;

  // ─── Forms ────────────────────────────────────────────────────────
  dadosForm = new FormGroup({
    nome:     new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:    new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl(''),
    regiao:   new FormControl(''),
  });

  senhaForm = new FormGroup({
    atual:       new FormControl('', [Validators.required]),
    nova:        new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmacao: new FormControl('', [Validators.required]),
  });

  preferencias = {
    notificacoesEmail: true,
    notificacoesWpp: false,
    temaEscuro: false,
    idioma: 'pt-br',
  };

  estatisticas = {
    livrosEmprestados: 0,
    comprasRealizadas: 0,
    multasPendentes: 0,
  };

  statusLabels: Record<number, { label: string; cls: string }> = {
    1: { label: 'Ativo',     cls: 'ativo' },
    2: { label: 'Inativo',   cls: 'inativo' },
    3: { label: 'Bloqueado', cls: 'bloqueado' },
    4: { label: 'Pendente',  cls: 'pendente' },
    5: { label: 'Suspenso',  cls: 'suspenso' },
  };

  ngOnInit(): void {
    this.sessionRaw = this.auth.session;
    if (!this.sessionRaw) return;

    this.user = this.mapSessionToView(this.sessionRaw, this.auth.profile);
    this.dadosForm.patchValue({
      nome:     this.user.nome,
      email:    this.user.email,
      telefone: this.user.telefone ?? '',
      regiao:   this.user.regiao ?? '',
    });

    // carrega preferencias salvas local
    const prefsRaw = localStorage.getItem('userPreferencias');
    if (prefsRaw) {
      try { this.preferencias = { ...this.preferencias, ...JSON.parse(prefsRaw) }; } catch {}
    }

    // estatisticas só pra leitor (mock por enquanto — poderia vir de endpoint)
    if (!this.user.isFuncionario) {
      this.estatisticas = {
        livrosEmprestados: 12,
        comprasRealizadas: 4,
        multasPendentes: 0,
      };
    }
  }

  // ─── Mapping ──────────────────────────────────────────────────────
  private mapSessionToView(s: any, role: UserProfile | null): ViewUser {
    const isFunc = s?.idPerfilFuncionarios != null;

    const nome     = isFunc ? s.NomeFunc    : s.Nome;
    const email    = isFunc ? s.EmailFunc   : s.Email;
    const cpf      = isFunc ? s.CPFFunc     : s.CPF;
    const telefone = isFunc ? undefined     : s.Telefone;
    const created  = s.created_date || s.created_at;

    return {
      id:           isFunc ? s.id : s.idUsuario,
      nome:         nome ?? '—',
      email:        email ?? '—',
      cpf:          cpf ?? '—',
      telefone,
      matricula:    s.MatriculaFunc,
      regiao:       s.RegiaoFunc,
      role:         role ?? 'LEITOR',
      avatar:       s.fotoperfil || this.avatarFrom(nome),
      membroDesde:  this.formatMembro(created),
      status:       s.Status ?? 1,
      isFuncionario: isFunc,
    };
  }

  private avatarFrom(nome?: string): string {
    const n = encodeURIComponent(nome || 'User');
    return `https://ui-avatars.com/api/?name=${n}&background=10b981&color=fff&bold=true`;
  }

  private formatMembro(d: any): string {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '—';
    return dt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  // ─── UI ────────────────────────────────────────────────────────────
  changeTab(tab: TabName) { this.activeTab = tab; }

  isStaff(): boolean {
    return this.user?.isFuncionario;
  }

  roleLabel(): string {
    return this.user?.role ?? 'LEITOR';
  }

  statusInfo() {
    return this.statusLabels[this.user?.status] ?? { label: '—', cls: '' };
  }

  hasError(form: FormGroup, control: string): boolean {
    const c = form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  errorMessage(form: FormGroup, control: string): string {
    const c = form.get(control);
    if (!c?.errors) return '';
    if (c.errors['required'])  return 'Campo obrigatório';
    if (c.errors['email'])     return 'E-mail inválido';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    return 'Valor inválido';
  }

  // ─── Ações ─────────────────────────────────────────────────────────
  async saveProfile(): Promise<void> {
    if (this.dadosForm.invalid) {
      this.dadosForm.markAllAsTouched();
      this.alert.error('Formulário inválido', 'Verifique os campos destacados.');
      return;
    }

    const ok = await this.alert.confirm('Salvar alterações', 'Confirmar atualização do perfil?');
    if (!ok) return;

    const raw = this.dadosForm.getRawValue();
    this.savingProfile = true;

    if (this.user.isFuncionario) {
      const payload = {
        idFuncionario: this.user.id,
        NomeFunc:      raw.nome ?? '',
        EmailFunc:     raw.email ?? '',
        RegiaoFunc:    raw.regiao ?? this.user.regiao ?? '',
      } as any;

      this.funcionarioService.UpdateFuncionario(payload).subscribe({
        next: () => this.onSaveSuccess({ NomeFunc: raw.nome, EmailFunc: raw.email, RegiaoFunc: raw.regiao }),
        error: () => this.onSaveError(),
      });
    } else {
      const payload = {
        idUsuario: this.user.id,
        Nome:      raw.nome ?? '',
        Email:     raw.email ?? '',
        Telefone:  raw.telefone ?? '',
        CPF:       this.user.cpf,
      };

      this.clienteService.UpdateUsuario(payload).subscribe({
        next: () => this.onSaveSuccess({ Nome: raw.nome, Email: raw.email, Telefone: raw.telefone }),
        error: () => this.onSaveError(),
      });
    }
  }

  private onSaveSuccess(patch: any): void {
    this.savingProfile = false;
    // atualiza sessão local refletindo mudança
    const updated = { ...this.sessionRaw, ...patch };
    this.auth.setSession(updated);
    this.sessionRaw = updated;
    this.user = this.mapSessionToView(updated, this.auth.profile);
    this.alert.toastSuccess('Perfil atualizado');
  }

  private onSaveError(): void {
    this.savingProfile = false;
    this.alert.error('Erro', 'Falha ao atualizar perfil');
  }

  async changePassword(): Promise<void> {
    if (this.senhaForm.invalid) {
      this.senhaForm.markAllAsTouched();
      this.alert.error('Formulário inválido', 'Preencha todos os campos.');
      return;
    }

    const { nova, confirmacao } = this.senhaForm.getRawValue();
    if (nova !== confirmacao) {
      this.alert.error('Senhas diferentes', 'A confirmação não bate com a nova senha.');
      return;
    }

    const ok = await this.alert.confirm('Alterar senha', 'Confirmar troca de senha?');
    if (!ok) return;

    this.savingPassword = true;

    const req$ = this.user.isFuncionario
      ? this.funcionarioService.UpdateSenhaFuncionario({ idFuncionario: this.user.id, SenhaFunc: nova! })
      : this.clienteService.UpdateSenhaUsuario({ idUsuario: this.user.id, Senha: nova! });

    req$.subscribe({
      next: () => {
        this.savingPassword = false;
        this.senhaForm.reset();
        this.alert.toastSuccess('Senha alterada');
      },
      error: () => {
        this.savingPassword = false;
        this.alert.error('Erro', 'Falha ao alterar senha');
      },
    });
  }

  savePreferencias(): void {
    localStorage.setItem('userPreferencias', JSON.stringify(this.preferencias));
    this.alert.toastSuccess('Preferências salvas');
  }

  logout(): void {
    this.auth.logout();
    location.href = '/auth/log-in';
  }
}
