import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsuariosLogados } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html',
  styleUrls: ['./modal-edit-cliente.component.scss'],
})
export class ModalEditClienteComponent implements OnInit {
  ref = inject(MatDialogRef<ModalEditClienteComponent>);
  data = inject(MAT_DIALOG_DATA);
  userinfo!:UsuariosLogados;
  form = new FormGroup({
    nomeCompleto: new FormControl('',[Validators.required]),
    cpf: new FormControl('',[Validators.required]),
    telefone: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    status: new FormControl('',[Validators.required]),
    senha: new FormControl('',[Validators.required]),
    senhaInicial: new FormControl(false),
    
  })

  ngOnInit(): void {
    this.userinfo = this.data;
    console.log('Dados recebidos no modal:', this.userinfo);
    this.form.patchValue({
      nomeCompleto: this.userinfo.Nome,
      cpf: this.userinfo.CPF,
      telefone: this.userinfo.Telefone,
      email: this.userinfo.Email,
      status: this.userinfo.Status,
      senha: this.userinfo.Senha,
      senhaInicial: this.userinfo.SenhaInicial
    }
    );
  }

  salvar() {
    
  }

  fechar() {
    this.ref.close();
  }
}
