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
  activeStep: 'pessoal' | 'endereco' | 'banco' | 'acesso' = 'pessoal';

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
    { label: 'Ativo',     value: 1 },
    { label: 'Inativo',   value: 2 },
    { label: 'Bloqueado', value: 3 },
  ];

  tiposConta = [
    { label: 'Conta Corrente', value: 'Corrente' },
    { label: 'Poupança',       value: 'Poupança' },
    { label: 'Conta Salário',  value: 'Salário' },
  ];

  estadosBR = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  // ─── Forms (reactive em 4 grupos) ─────────────────────────────────────
  pessoalForm = new FormGroup({
    id:            new FormControl<number | null>(null),
    MatriculaFunc: new FormControl('', [Validators.required]),
    NomeFunc:      new FormControl('', [Validators.required, Validators.minLength(3)]),
    CPFFunc:       new FormControl('', [Validators.required]),
    EmailFunc:     new FormControl('', [Validators.required, Validators.email]),
    RegiaoFunc:    new FormControl('', [Validators.required, Validators.maxLength(2)]),
  });

  enderecoForm = new FormGroup({
    idInfoEnd:     new FormControl<number | null>(null),
    // TC-EB-06: aceita "01000-000" ou "01000000".
    CEP:           new FormControl('', [Validators.pattern(/^\d{5}-?\d{3}$/)]),
    Logradouro:    new FormControl(''),
    Numero:        new FormControl<number | null>(null),
    Bairro:        new FormControl(''),
    Cidade:        new FormControl(''),
    Estado:        new FormControl(''),
    Nacionalidade: new FormControl('Brasileira'),
    Complemento:   new FormControl(''),
  });

  bancoForm = new FormGroup({
    IdInfoBancario: new FormControl<number | null>(null),
    NomeBanco:      new FormControl(''),
    CodigoBanco:    new FormControl<number | null>(null),
    TipoConta:      new FormControl('Corrente'),
    NumeroAgencia:  new FormControl<number | null>(null),
    DigitoAgencia:  new FormControl<number | null>(null),
    NumeroConta:    new FormControl<number | null>(null),
    DigitoConta:    new FormControl<number | null>(null),
    CodigosPix:     new FormControl(''),
  });

  acessoForm = new FormGroup({
    SenhaFunc:            new FormControl(''),
    idPerfilFuncionarios: new FormControl<string>('2', [Validators.required]),
    Status:               new FormControl<number>(1, [Validators.required]),
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
        f.MatriculaFunc?.toLowerCase().includes(txt) ||
        f.EmailFunc?.toLowerCase().includes(txt),
    );
  }

  abrirModal(func?: any): void {
    this.isEditMode = !!func;
    this.activeStep = 'pessoal';

    this.pessoalForm.reset({
      id: null, MatriculaFunc: '', NomeFunc: '', CPFFunc: '',
      EmailFunc: '', RegiaoFunc: '',
    });
    this.enderecoForm.reset({
      idInfoEnd: null, CEP: '', Logradouro: '', Numero: null,
      Bairro: '', Cidade: '', Estado: '',
      Nacionalidade: 'Brasileira', Complemento: '',
    });
    this.bancoForm.reset({
      IdInfoBancario: null, NomeBanco: '', CodigoBanco: null,
      TipoConta: 'Corrente', NumeroAgencia: null, DigitoAgencia: null,
      NumeroConta: null, DigitoConta: null, CodigosPix: '',
    });
    this.acessoForm.reset({
      SenhaFunc: '', idPerfilFuncionarios: '2', Status: 1,
    });

    // Senha obrigatória só no cadastro
    const senhaCtrl = this.acessoForm.controls.SenhaFunc;
    if (this.isEditMode) {
      senhaCtrl.clearValidators();
    } else {
      senhaCtrl.setValidators([Validators.required, Validators.minLength(4)]);
    }
    senhaCtrl.updateValueAndValidity();

    if (func) {
      this.pessoalForm.patchValue({
        id:            func.id ?? func.idFuncionario,
        MatriculaFunc: func.MatriculaFunc,
        NomeFunc:      func.NomeFunc,
        CPFFunc:       func.CPFFunc,
        EmailFunc:     func.EmailFunc,
        RegiaoFunc:    func.RegiaoFunc,
      });
      this.acessoForm.patchValue({
        idPerfilFuncionarios: func.idPerfilFuncionarios ?? '2',
        Status: func.StatusAtividadeGeral_idStatus ?? func.Status ?? 1,
      });

      const end = func.endereco;
      if (end) {
        this.enderecoForm.patchValue({
          idInfoEnd: end.idInfoEnd,
          CEP: end.CEP, Logradouro: end.Logradouro, Numero: end.Numero,
          Bairro: end.Bairro, Cidade: end.Cidade, Estado: end.Estado,
          Nacionalidade: end.Nacionalidade || 'Brasileira',
          Complemento: end.Complemento || '',
        });
      }
      const bk = func.banco;
      if (bk) {
        this.bancoForm.patchValue({
          IdInfoBancario: bk.IdInfoBancario,
          NomeBanco: bk.NomeBanco, CodigoBanco: bk.CodigoBanco,
          TipoConta: bk.TipoConta, NumeroAgencia: bk.NumeroAgencia,
          DigitoAgencia: bk.DigitoAgencia, NumeroConta: bk.NumeroConta,
          DigitoConta: bk.DigitoConta, CodigosPix: bk.CodigosPix || '',
        });
      }
    }

    this.isModalOpen = true;
  }

  fecharModal(): void {
    this.isModalOpen = false;
  }

  setStep(step: 'pessoal' | 'endereco' | 'banco' | 'acesso'): void {
    this.activeStep = step;
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
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres`;
    return 'Valor inválido';
  }

  /** Constrói o payloadEndereco se houver dados. */
  private buildPayloadEndereco(): any {
    const v = this.enderecoForm.getRawValue();
    if (!v.CEP && !v.Logradouro && !v.Cidade) return undefined;
    return {
      Logradouro: v.Logradouro || '',
      Bairro: v.Bairro || '',
      Numero: v.Numero ?? null,
      Cidade: v.Cidade || '',
      Estado: v.Estado || '',
      Nacionalidade: v.Nacionalidade || 'Brasileira',
      CEP: v.CEP || '',
      Complemento: v.Complemento || '',
    };
  }

  private buildPayloadBanco(): any {
    const v = this.bancoForm.getRawValue();
    if (!v.NomeBanco && !v.NumeroConta && !v.CodigosPix) return undefined;
    return {
      NomeBanco: v.NomeBanco || '',
      CodigoBanco: v.CodigoBanco ?? null,
      TipoConta: v.TipoConta || 'Corrente',
      NumeroAgencia: v.NumeroAgencia ?? null,
      DigitoAgencia: v.DigitoAgencia ?? null,
      NumeroConta: v.NumeroConta ?? null,
      DigitoConta: v.DigitoConta ?? null,
      CodigosPix: v.CodigosPix || '',
    };
  }

  async salvar(): Promise<void> {
    if (this.pessoalForm.invalid || this.acessoForm.invalid) {
      this.pessoalForm.markAllAsTouched();
      this.acessoForm.markAllAsTouched();
      this.alert.error('Formulário inválido', 'Verifique os campos destacados.');
      this.activeStep = this.pessoalForm.invalid ? 'pessoal' : 'acesso';
      return;
    }

    const ok = await this.alert.confirm(
      this.isEditMode ? 'Salvar alterações' : 'Criar funcionário',
      this.isEditMode ? 'Confirmar alteração dos dados?' : 'Deseja cadastrar este novo funcionário?',
    );
    if (!ok) return;

    const pessoal = this.pessoalForm.getRawValue();
    const acesso  = this.acessoForm.getRawValue();
    this.saving = true;

    if (this.isEditMode) {
      const payload: any = {
        payloadFuncionario: {
          idFuncionario:        pessoal.id!,
          MatriculaFunc:        pessoal.MatriculaFunc ?? '',
          NomeFunc:             pessoal.NomeFunc ?? '',
          CPFFunc:              pessoal.CPFFunc ?? '',
          EmailFunc:            pessoal.EmailFunc ?? '',
          RegiaoFunc:           pessoal.RegiaoFunc ?? '',
          idPerfilFuncionarios: acesso.idPerfilFuncionarios ?? '2',
          StatusAtividadeGeral_idStatus: acesso.Status ?? 1,
        },
        payloadEndereco: this.buildPayloadEndereco(),
        payloadBanco:    this.buildPayloadBanco(),
      };

      this.FuncionarioService.UpdateFuncionario(payload).subscribe({
        next: () => { this.saving = false; this.alert.toastSuccess('Funcionário atualizado'); this.fecharModal(); this.carregarFuncionarios(); },
        error: () => { this.saving = false; this.alert.error('Erro', 'Falha ao atualizar'); },
      });
    } else {
      const payload = {
        payloadFuncionario: {
          MatriculaFunc:        pessoal.MatriculaFunc ?? '',
          NomeFunc:             pessoal.NomeFunc ?? '',
          CPFFunc:              pessoal.CPFFunc ?? '',
          EmailFunc:            pessoal.EmailFunc ?? '',
          RegiaoFunc:           pessoal.RegiaoFunc ?? '',
          SenhaFunc:            acesso.SenhaFunc ?? '',
          SenhaInicialFunc:     1,
          idPerfilFuncionarios: acesso.idPerfilFuncionarios ?? '2',
          StatusAtividadeGeral_idStatus: acesso.Status ?? 1,
        },
        payloadEndereco: this.buildPayloadEndereco() || {},
        payloadBanco:    this.buildPayloadBanco()    || {},
      };

      this.FuncionarioService.CriarFuncionario(payload).subscribe({
        next: () => { this.saving = false; this.alert.toastSuccess('Funcionário cadastrado'); this.fecharModal(); this.carregarFuncionarios(); },
        error: () => { this.saving = false; this.alert.error('Erro', 'Falha ao cadastrar'); },
      });
    }
  }

  async excluir(id: number): Promise<void> {
    const ok = await this.alert.confirm('Excluir', 'Deseja remover este funcionário?');
    if (!ok) return;

    this.FuncionarioService.DeleteFuncionario(id).subscribe({
      next: () => {
        this.funcionarios = this.funcionarios.filter((f: any) => (f.id ?? f.idFuncionario) !== id);
        this.aplicarFiltro();
        this.alert.toastSuccess('Funcionário removido');
      },
      error: () => this.alert.error('Erro', 'Falha ao excluir'),
    });
  }

  getPerfilLabel(id: string): string {
    return this.perfisDisponiveis.find((p) => p.value === id)?.label ?? '—';
  }

  getStatusLabel(id: number): string {
    return this.statusOptions.find((s) => s.value === id)?.label ?? '—';
  }

  getCidadeUF(func: any): string {
    if (!func.endereco) return '—';
    return `${func.endereco.Cidade || '?'}/${func.endereco.Estado || '?'}`;
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
