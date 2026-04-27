import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientesService } from '../../../services/Clientes.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html',
  styleUrls: ['./modal-edit-cliente.component.scss'],
})
export class ModalEditClienteComponent implements OnInit {
  ref = inject(MatDialogRef<ModalEditClienteComponent>, { optional: true });
  data = inject(MAT_DIALOG_DATA, { optional: true });
  alert = inject(AlertService);
  private clienteService = inject(ClientesService);

  isEdit = false;
  loading = false;
  activeStep: 'pessoal' | 'endereco' | 'banco' | 'acesso' = 'pessoal';

  statusOptions = [
    { label: 'Ativo', value: 1 },
    { label: 'Inativo', value: 2 },
    { label: 'Bloqueado', value: 3 },
    { label: 'Pendente', value: 4 },
    { label: 'Suspenso', value: 5 },
  ];

  tiposConta = [
    { label: 'Conta Corrente', value: 'Corrente' },
    { label: 'Poupança',       value: 'Poupança' },
  ];

  estadosBR = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

  pessoalForm = new FormGroup({
    idUsuario:    new FormControl<number | null>(null),
    nomeCompleto: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cpf:          new FormControl('', [Validators.required]),
    telefone:     new FormControl('', [Validators.required]),
    email:        new FormControl('', [Validators.required, Validators.email]),
    fotoperfil:   new FormControl<string | null>(null),
  });

  enderecoForm = new FormGroup({
    idInfoEnd:     new FormControl<number | null>(null),
    CEP:           new FormControl(''),
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
    senha:        new FormControl(''),
    senhaInicial: new FormControl<boolean>(true),
    status:       new FormControl<number>(1, [Validators.required]),
  });

  ngOnInit(): void {
    const user = this.data;
    this.isEdit = !!user?.idUsuario;

    if (!this.isEdit) {
      this.acessoForm.controls.senha.addValidators([Validators.required, Validators.minLength(4)]);
      this.acessoForm.controls.senha.updateValueAndValidity();
    }

    if (user) {
      this.pessoalForm.patchValue({
        idUsuario:    user.idUsuario,
        nomeCompleto: user.Nome,
        cpf:          user.CPF,
        telefone:     user.Telefone,
        email:        user.Email,
        fotoperfil:   user.fotoperfil ?? null,
      });
      this.acessoForm.patchValue({
        status:       user.Status ?? 1,
        senhaInicial: !!user.SenhaInicial,
      });

      const end = user.endereco;
      if (end) {
        this.enderecoForm.patchValue({
          idInfoEnd: end.idInfoEnd,
          CEP: end.CEP, Logradouro: end.Logradouro, Numero: end.Numero,
          Bairro: end.Bairro, Cidade: end.Cidade, Estado: end.Estado,
          Nacionalidade: end.Nacionalidade || 'Brasileira',
          Complemento: end.Complemento || '',
        });
      }
      const bk = user.banco;
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
    return 'Valor inválido';
  }

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
      this.isEdit ? 'Salvar alterações' : 'Criar usuário',
      this.isEdit ? 'Confirmar alteração dos dados?' : 'Deseja cadastrar este novo leitor?',
    );
    if (!ok) return;

    const pessoal = this.pessoalForm.getRawValue();
    const acesso  = this.acessoForm.getRawValue();
    this.loading = true;

    if (this.isEdit) {
      const payload = {
        payloadUser: {
          idUsuario:  pessoal.idUsuario!,
          Nome:       pessoal.nomeCompleto ?? '',
          CPF:        pessoal.cpf ?? '',
          Telefone:   pessoal.telefone ?? '',
          Email:      pessoal.email ?? '',
          Status:     acesso.status ?? 1,
          fotoperfil: pessoal.fotoperfil ?? undefined,
        },
        payloadEndereco: this.buildPayloadEndereco(),
        payloadBanco:    this.buildPayloadBanco(),
      };

      this.clienteService.UpdateUsuario(payload as any).subscribe({
        next: () => { this.loading = false; this.alert.success('Sucesso', 'Dados atualizados'); this.ref?.close(true); },
        error: () => { this.loading = false; this.alert.error('Erro', 'Falha ao salvar'); },
      });
    } else {
      const payload = {
        payloadUser: {
          Nome:         pessoal.nomeCompleto ?? '',
          CPF:          pessoal.cpf ?? '',
          Telefone:     pessoal.telefone ?? '',
          Email:        pessoal.email ?? '',
          Senha:        acesso.senha ?? '',
          SenhaInicial: acesso.senhaInicial ? 1 : 0,
          Status:       acesso.status ?? 1,
          fotoperfil:   pessoal.fotoperfil ?? null,
        },
        payloadEndereco: this.buildPayloadEndereco() || {},
        payloadBanco:    this.buildPayloadBanco()    || {},
      };

      this.clienteService.CriarUsuario(payload).subscribe({
        next: () => { this.loading = false; this.alert.success('Cadastrado', 'Leitor criado com sucesso'); this.ref?.close(true); },
        error: () => { this.loading = false; this.alert.error('Erro', 'Falha ao criar usuário'); },
      });
    }
  }

  fechar(): void {
    this.ref?.close(false);
  }
}
