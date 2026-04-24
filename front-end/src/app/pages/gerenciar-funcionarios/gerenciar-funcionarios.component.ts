import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FuncionariosLogados } from 'src/app/models/funcionarios.model';
import { FuncionariosService } from 'src/app/services/Funcionarios.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-gerenciar-funcionarios',
  templateUrl: './gerenciar-funcionarios.component.html',
  styleUrls: ['./gerenciar-funcionarios.component.scss'],
})
export class GerenciarFuncionariosComponent implements OnInit {
  private FuncionarioService = inject(FuncionariosService);
  private alert              = inject(AlertService);

  isModalOpen = false;
  isEditMode  = false;
  filtroTexto = '';
  loading     = true;
  saving      = false;

  funcionarios: FuncionariosLogados[] = [];
  funcionariosFiltrados: FuncionariosLogados[] = [];

  perfisDisponiveis = [
    { label: 'Administrador', value: '1' },
    { label: 'Bibliotecário', value: '2' },
    { label: 'Financeiro',    value: '3' },
    { label: 'Estoque',       value: '4' },
    { label: 'Usuário',       value: '5' },
  ];

  statusOptions = [
    { label: 'Ativo',    value: 1 },
    { label: 'Inativo',  value: 2 },
    { label: 'Bloqueado', value: 3 },
  ];

  form = new FormGroup({
    id:                    new FormControl<number | null>(null),
    MatriculaFunc:         new FormControl('', [Validators.required]),
    NomeFunc:              new FormControl('', [Validators.required, Validators.minLength(3)]),
    CPFFunc:               new FormControl('', [Validators.required]),
    EmailFunc:             new FormControl('', [Validators.required, Validators.email]),
    RegiaoFunc:            new FormControl('', [Validators.required, Validators.maxLength(2)]),
    SenhaFunc:             new FormControl(''),
    idPerfilFuncionarios:  new FormControl<string>('2', [Validators.required]),
    Status:                new FormControl<number>(1, [Validators.required]),
    InfoBancario_IdInfoBancario: new FormControl<number | null>(null),
    InfoEndereco_idInfoEnd:      new FormControl<number | null>(null),
  });

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.loading = true;
    this.FuncionarioService.BuscarFuncionarios().subscribe({
      next: (res) => {
        this.funcionarios = res;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar funcionários');
        this.loading = false;
      },
    });
  }

  aplicarFiltro(): void {
    const txt = this.filtroTexto.toLowerCase();
    this.funcionariosFiltrados = this.funcionarios.filter(
      (f) =>
        f.NomeFunc?.toLowerCase().includes(txt) ||
        f.MatriculaFunc?.toLowerCase().includes(txt),
    );
  }

  abrirModal(func?: FuncionariosLogados): void {
    this.isEditMode = !!func;
    this.form.reset({
      id: null,
      MatriculaFunc: '',
      NomeFunc: '',
      CPFFunc: '',
      EmailFunc: '',
      RegiaoFunc: '',
      SenhaFunc: '',
      idPerfilFuncionarios: '2',
      Status: 1,
      InfoBancario_IdInfoBancario: null,
      InfoEndereco_idInfoEnd: null,
    });

    // senha obrigatória somente no cadastro
    const senhaCtrl = this.form.controls.SenhaFunc;
    if (this.isEditMode) {
      senhaCtrl.clearValidators();
    } else {
      senhaCtrl.setValidators([Validators.required, Validators.minLength(4)]);
    }
    senhaCtrl.updateValueAndValidity();

    if (func) {
      this.form.patchValue({
        id:                    func.id,
        MatriculaFunc:         func.MatriculaFunc,
        NomeFunc:              func.NomeFunc,
        CPFFunc:               func.CPFFunc,
        EmailFunc:             func.EmailFunc,
        RegiaoFunc:            func.RegiaoFunc,
        idPerfilFuncionarios:  func.idPerfilFuncionarios ?? '2',
        Status:                func.Status ?? 1,
        InfoBancario_IdInfoBancario: func.InfoBancario_IdInfoBancario ?? null,
        InfoEndereco_idInfoEnd:      func.InfoEndereco_idInfoEnd ?? null,
      });
    }

    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.isModalOpen = false;
  }

  hasError(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  errorMessage(control: string): string {
    const c = this.form.get(control);
    if (!c?.errors) return '';
    if (c.errors['required'])  return 'Campo obrigatório';
    if (c.errors['email'])     return 'E-mail inválido';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres`;
    return 'Valor inválido';
  }

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.error('Formulário inválido', 'Verifique os campos destacados.');
      return;
    }

    const ok = await this.alert.confirm(
      this.isEditMode ? 'Salvar alterações' : 'Criar funcionário',
      this.isEditMode ? 'Confirmar alteração dos dados?' : 'Deseja cadastrar este novo funcionário?',
    );
    if (!ok) return;

    const raw = this.form.getRawValue();
    this.saving = true;

    if (this.isEditMode) {
      const payload = {
        idFuncionario:        raw.id!,
        MatriculaFunc:        raw.MatriculaFunc ?? '',
        NomeFunc:             raw.NomeFunc ?? '',
        CPFFunc:              raw.CPFFunc ?? '',
        EmailFunc:            raw.EmailFunc ?? '',
        RegiaoFunc:           raw.RegiaoFunc ?? '',
        idPerfilFuncionarios: raw.idPerfilFuncionarios ?? '2',
        Status:               raw.Status ?? 1,
      };

      this.FuncionarioService.UpdateFuncionario(payload).subscribe({
        next: () => {
          this.saving = false;
          this.alert.toastSuccess('Funcionário atualizado');
          this.fecharModal();
          this.carregarFuncionarios();
        },
        error: () => {
          this.saving = false;
          this.alert.error('Erro', 'Falha ao atualizar');
        },
      });
    } else {
      const payload = {
        payloadFuncionario: {
          MatriculaFunc:        raw.MatriculaFunc ?? '',
          NomeFunc:             raw.NomeFunc ?? '',
          CPFFunc:              raw.CPFFunc ?? '',
          EmailFunc:            raw.EmailFunc ?? '',
          RegiaoFunc:           raw.RegiaoFunc ?? '',
          SenhaFunc:            raw.SenhaFunc ?? '',
          SenhaInicialFunc:     true,
          idPerfilFuncionarios: raw.idPerfilFuncionarios ?? '2',
          Status:               raw.Status ?? 1,
        },
        payloadBanco: {},
        payloadEndereco: {},
      };

      this.FuncionarioService.CriarFuncionario(payload).subscribe({
        next: () => {
          this.saving = false;
          this.alert.toastSuccess('Funcionário cadastrado');
          this.fecharModal();
          this.carregarFuncionarios();
        },
        error: () => {
          this.saving = false;
          this.alert.error('Erro', 'Falha ao cadastrar');
        },
      });
    }
  }

  async excluir(id: number): Promise<void> {
    const ok = await this.alert.confirm('Excluir', 'Deseja remover este funcionário?');
    if (!ok) return;

    this.FuncionarioService.DeleteFuncionario(id).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter((f) => f.id !== id);
        this.aplicarFiltro();
        this.alert.toastSuccess('Funcionário removido');
      },
      error: () => this.alert.error('Erro', 'Falha ao excluir'),
    });
  }

  getPerfilLabel(id: string): string {
    return this.perfisDisponiveis.find((p) => p.value === id)?.label ?? '—';
  }

  getIniciais(nome: string): string {
    return nome
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || '?';
  }
}
