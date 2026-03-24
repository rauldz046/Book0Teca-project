import { ClientesService } from './../../../services/clientes.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsuariosLogados } from 'src/app/models/clientes.model';
import { ToastService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html',
  styleUrls: ['./modal-edit-cliente.component.scss'],
})
export class ModalEditClienteComponent implements OnInit {
  ref = inject(MatDialogRef<ModalEditClienteComponent>);
  data = inject(MAT_DIALOG_DATA);
  alert = inject(ToastService);
  ClienteService = inject(ClientesService);
  userinfo!: UsuariosLogados;
  form = new FormGroup({
    idUsuario: new FormControl(),
    nomeCompleto: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    senha: new FormControl('', [Validators.required]),
    senhaInicial: new FormControl(false),
  });

  ngOnInit(): void {
    this.userinfo = this.data;
    console.log('Dados recebidos no modal:', this.userinfo);
    this.form.patchValue({
      idUsuario: this.userinfo.idUsuario,
      nomeCompleto: this.userinfo.Nome,
      cpf: this.userinfo.CPF,
      telefone: this.userinfo.Telefone,
      email: this.userinfo.Email,
      status: this.userinfo.Status,
      senha: this.userinfo.Senha,
      senhaInicial: this.userinfo.SenhaInicial,
    });
  }

  async salvar() {
    this.alert
      .confirm(
        'info',
        'Alterar Dados',
        'Deseja realmente alterar os dados do leitor?',
      )
      .subscribe((res) => {
        const formbody = this.form.getRawValue();

        this.ClienteService.UpdateUsuario(formbody).subscribe((res) => ({
          next: (res: any) => {
            this.alert
              .dialogSuccess('success', 'Dados alterados com sucesso')
              .subscribe((res) => {
                if (res) {
                  this.ref.close();
                }
              });
          },
        }));
      });
  }

  fechar() {
    this.ref.close();
  }
}
