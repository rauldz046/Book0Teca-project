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

  statusOptions = [
    { label: 'Ativo', value: 1 },
    { label: 'Inativo', value: 2 },
    { label: 'Bloqueado', value: 3 },
    { label: 'Pendente', value: 4 },
    { label: 'Suspenso', value: 5 },
  ];

  form = new FormGroup({
    idUsuario:    new FormControl<number | null>(null),
    nomeCompleto: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cpf:          new FormControl('', [Validators.required]),
    telefone:     new FormControl('', [Validators.required]),
    email:        new FormControl('', [Validators.required, Validators.email]),
    senha:        new FormControl(''),
    senhaInicial: new FormControl<boolean>(true),
    fotoperfil:   new FormControl<string | null>(null),
    status:       new FormControl<number>(1, [Validators.required]),
  });

  ngOnInit(): void {
    const user = this.data;
    this.isEdit = !!user?.idUsuario;

    // senha é obrigatória somente no cadastro
    if (!this.isEdit) {
      this.form.controls.senha.addValidators([Validators.required, Validators.minLength(4)]);
      this.form.controls.senha.updateValueAndValidity();
    }

    if (user) {
      this.form.patchValue({
        idUsuario:    user.idUsuario,
        nomeCompleto: user.Nome,
        cpf:          user.CPF,
        telefone:     user.Telefone,
        email:        user.Email,
        fotoperfil:   user.fotoperfil ?? null,
        status:       user.Status ?? 1,
        senhaInicial: !!user.SenhaInicial,
      });
    }
  }

  // ─── helpers de validação ────────────────────────────────────────────
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
    return 'Valor inválido';
  }

  // ─── ações ───────────────────────────────────────────────────────────
  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.error('Formulário inválido', 'Verifique os campos destacados.');
      return;
    }

    const ok = await this.alert.confirm(
      this.isEdit ? 'Salvar alterações' : 'Criar usuário',
      this.isEdit ? 'Confirmar alteração dos dados?' : 'Deseja cadastrar este novo leitor?',
    );
    if (!ok) return;

    const raw = this.form.getRawValue();
    this.loading = true;

    if (this.isEdit) {
      const payload = {
        idUsuario:  raw.idUsuario!,
        Nome:       raw.nomeCompleto ?? '',
        CPF:        raw.cpf ?? '',
        Telefone:   raw.telefone ?? '',
        Email:      raw.email ?? '',
        Status:     raw.status ?? 1,
        fotoperfil: raw.fotoperfil ?? undefined,
      };

      this.clienteService.UpdateUsuario(payload).subscribe({
        next: () => {
          this.loading = false;
          this.alert.success('Sucesso', 'Dados atualizados');
          this.ref?.close(true);
        },
        error: () => {
          this.loading = false;
          this.alert.error('Erro', 'Falha ao salvar');
        },
      });
    } else {
      const payload = {
        payloadUser: {
          Nome:         raw.nomeCompleto ?? '',
          CPF:          raw.cpf ?? '',
          Telefone:     raw.telefone ?? '',
          Email:        raw.email ?? '',
          Senha:        raw.senha ?? '',
          SenhaInicial: raw.senhaInicial ? 1 : 0,
          Status:       raw.status ?? 1,
          fotoperfil:   raw.fotoperfil ?? null,
        },
        payloadBanco: {},
        payloadEndereco: {},
      };

      this.clienteService.CriarUsuario(payload).subscribe({
        next: () => {
          this.loading = false;
          this.alert.success('Cadastrado', 'Leitor criado com sucesso');
          this.ref?.close(true);
        },
        error: () => {
          this.loading = false;
          this.alert.error('Erro', 'Falha ao criar usuário');
        },
      });
    }
  }

  fechar(): void {
    this.ref?.close(false);
  }
}
