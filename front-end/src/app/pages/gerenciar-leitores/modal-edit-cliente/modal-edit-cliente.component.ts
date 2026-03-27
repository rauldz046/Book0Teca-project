import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
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
  // Injeções do PrimeNG
  ref = inject(MatDialogRef<ModalEditClienteComponent>, { optional: true });
  data = inject(MAT_DIALOG_DATA, { optional: true });

  alert = inject(AlertService);
  ClienteService = inject(ClientesService);

  userinfo!: UsuariosLogados;
  isEdit = false;
  loading = false;

  // Opções para o Select do PrimeNG
  statusOptions = [
    { label: 'Ativo', value: 1, icon: 'pi pi-check-circle', color: '#4caf50' },
    {
      label: 'Inativo',
      value: 0,
      icon: 'pi pi-times-circle',
      color: '#f44336',
    },
  ];

  form = new FormGroup({
    idUsuario: new FormControl(),
    nomeCompleto: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    fotoperfil: new FormControl(''), // Adicionado conforme o HTML anterior
    senha: new FormControl('', [Validators.required]),
    senhaInicial: new FormControl(false),
  });

  ngOnInit(): void {
    this.userinfo = this.data;
    this.isEdit = !!this.userinfo?.idUsuario;

    if (this.userinfo) {
      this.form.patchValue({
        idUsuario: this.userinfo.idUsuario,
        nomeCompleto: this.userinfo.Nome,
        cpf: this.userinfo.CPF,
        telefone: this.userinfo.Telefone,
        email: this.userinfo.Email,
        status: this.userinfo.Status,
        senha: this.userinfo.Senha,
        senhaInicial: this.userinfo.SenhaInicial,
        fotoperfil: (this.userinfo as any).fotoperfil, // Ajuste se necessário
      });
    }
  }

  async salvar() {
    const confir = await this.alert.confirm(
      'Alterar Dados',
      'Deseja realmente salvar os dados?',
    );
    if (!confir) {
      return;
    }
    this.loading = true;
    const formbody = this.form.getRawValue();
    this.ClienteService.UpdateUsuario(formbody).subscribe({
      next: () => {
        this.loading = false;
        this.alert.success('success', 'Dados alterados com sucesso');
        this.ref?.close();
      },
      error: () => (this.loading = false),
    });
  }

  fechar() {
    this.ref?.close();
  }
}
