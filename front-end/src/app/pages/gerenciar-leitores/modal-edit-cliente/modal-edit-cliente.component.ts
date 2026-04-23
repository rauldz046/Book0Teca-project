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
  ClienteService = inject(ClientesService);

  isEdit = false;
  loading = false;

  statusOptions = [
    { label: 'Ativo', value: 1 },
    { label: 'Inativo', value: 2 },
  ];

  form = new FormGroup({
    idUsuario: new FormControl<number | null>(null),
    nomeCompleto: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    status: new FormControl<number>(1, [Validators.required]),
  });

  ngOnInit(): void {
    const user = this.data;
    this.isEdit = !!user?.idUsuario;

    if (user) {
      this.form.patchValue({
        idUsuario: user.idUsuario,
        nomeCompleto: user.Nome,
        cpf: user.CPF,
        telefone: user.Telefone,
        email: user.Email,
        status: user.Status,
      });
    }
  }

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.alert.error('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const ok = await this.alert.confirm(
      'Salvar',
      'Confirmar alteração dos dados?',
    );
    if (!ok) return;

    this.loading = true;
    const raw = this.form.getRawValue();

    // Mapeamento form → campos do banco
    const payload = {
      idUsuario: raw.idUsuario!,
      Nome: raw.nomeCompleto ?? '',
      CPF: raw.cpf ?? '',
      Telefone: raw.telefone ?? '',
      Email: raw.email ?? '',
      Status: raw.status ?? 1,
    };

    this.ClienteService.UpdateUsuario(payload).subscribe({
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
  }

  fechar(): void {
    this.ref?.close(false);
  }
}
