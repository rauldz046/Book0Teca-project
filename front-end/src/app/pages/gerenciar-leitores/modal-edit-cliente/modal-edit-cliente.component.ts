import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'; // Troca aqui
import { UsuariosLogados } from 'src/app/models/clientes.model';
import { ClientesService } from './../../../services/clientes.service';
import { ToastService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-modal-edit-cliente',
  templateUrl: './modal-edit-cliente.component.html',
  styleUrls: ['./modal-edit-cliente.component.scss'],
})
export class ModalEditClienteComponent implements OnInit {
  // Injeções do PrimeNG
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  
  alert = inject(ToastService);
  ClienteService = inject(ClientesService);
  
  userinfo!: UsuariosLogados;
  data: any;
  isEdit = false;
  loading = false;

  // Opções para o Select do PrimeNG
  statusOptions = [
    { label: 'Ativo', value: 1, icon: 'pi pi-check-circle', color: '#4caf50' },
    { label: 'Inativo', value: 0, icon: 'pi pi-times-circle', color: '#f44336' }
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
    // No PrimeNG DynamicDialog, os dados vêm em config.data
    this.userinfo = this.config.data;
    this.data = this.config.data;
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
        fotoperfil: (this.userinfo as any).fotoperfil // Ajuste se necessário
      });
    }
  }

  salvar() {
    this.alert.confirm('info', 'Alterar Dados', 'Deseja realmente salvar os dados?')
      .subscribe((res) => {
        if (res) {
          this.loading = true;
          const formbody = this.form.getRawValue();
          this.ClienteService.UpdateUsuario(formbody).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.alert.dialogSuccess('success', 'Dados alterados com sucesso')
                .subscribe(() => this.ref.close(true));
            },
            error: () => this.loading = false
          });
        }
      });
  }

  fechar() {
    this.ref.close();
  }
}