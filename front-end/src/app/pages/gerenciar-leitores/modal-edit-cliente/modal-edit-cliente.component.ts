import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuariosLogados } from 'src/app/models/clientes.model';
import { ClientesService } from '../../../services/Clientes.service';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  userinfo!: UsuariosLogados;
  isEdit = false;
  loading = false;

  statusOptions = [
    { label: 'Ativo', value: '1' },
    { label: 'Inativo', value: '2' },
  ];

  form = new FormGroup({
    idUsuario: new FormControl<number | null>(null),
    nomeCompleto: new FormControl<string>('', [Validators.required]),
    cpf: new FormControl<string>('', [Validators.required]),
    telefone: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    status: new FormControl<string>('1', [Validators.required]),
    fotoperfil: new FormControl<string>(''),
  });

  ngOnInit(): void {
    this.userinfo = this.data;
    this.isEdit = !!this.userinfo?.idUsuario;

    if (this.userinfo) {
      this.form.patchValue({
        idUsuario: this.userinfo.idUsuario,
        nomeCompleto: this.userinfo.Nome || '',
        cpf: this.userinfo.CPF || '',
        telefone: this.userinfo.Telefone || '',
        email: this.userinfo.Email || '',
        status: String(this.userinfo.Status || '1'),
        fotoperfil: (this.userinfo as any).fotoperfil || '',
      });
    }
  }

  async salvar() {
    if (this.form.invalid) {
      this.alert.error('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const confirmar = await this.alert.confirm(
      'Alterar Dados',
      'Deseja realmente salvar os dados?',
    );
    if (!confirmar) return;

    this.loading = true;

    const raw = this.form.getRawValue() as {
      idUsuario: number | null;
      nomeCompleto: string;
      cpf: string;
      telefone: string;
      email: string;
      status: string;
      fotoperfil: string;
    };

    // CORRIGIDO: mapeamento dos nomes do formulário para os nomes do banco
    const payload: Partial<UsuariosLogados> & { idUsuario: number } = {
      idUsuario: raw.idUsuario!,
      Nome: raw.nomeCompleto || '',
      CPF: raw.cpf || '',
      Telefone: raw.telefone || '',
      Email: raw.email || '',
      Status: raw.status || '1',
      fotoperfil: raw.fotoperfil || '',
    };

    this.ClienteService.UpdateUsuario(payload).subscribe({
      next: () => {
        this.loading = false;
        this.alert.success('Sucesso', 'Dados alterados com sucesso');
        this.ref?.close(true); // true = sinaliza que houve alteração → recarrega a lista
      },
      error: () => {
        this.loading = false;
        this.alert.error('Erro', 'Falha ao salvar os dados');
      },
    });
  }

  fechar() {
    this.ref?.close(false);
  }
}
