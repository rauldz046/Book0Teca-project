import { FuncionariosService } from 'src/app/services/Funcionarios.service';
import { ClientesService } from 'src/app/services/Clientes.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { UsuariosLogados } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit {
  private router = inject(Router);
  private clienteService = inject(ClientesService); // Corrigido para camelCase (padrão TS)
  private alert = inject(AlertService);
  private funcionarioService = inject(FuncionariosService);

  sessaoUser!: UsuariosLogados;
  isLoading = false; // Adicionado para controle de loading no botão
  isLogin = true;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Adicionado validador de e-mail
    senha: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  ngOnInit(): void {}

  goToSignIn() {
    this.router.navigate(['auth/sign-in']);
  }

  submit() {
  this.isLoading = true;
  const infoUser = this.form.getRawValue();

  this.clienteService.LoginValidation(infoUser).subscribe({
    next: (res: UsuariosLogados) => {
      if (res !== null) {
        this.isLoading = false;
        this.router.navigate(['/home']);
      } else {
        this.funcionarioService.LoginValidation(infoUser).subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res !== null) {
              this.router.navigate(['/home']);
            } else {
              this.alert.error('E-mail ou senha incorretos.');
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.alert.error('Falha no Login', "E-mail ou senha incorretos.");
          }
        });
      }
    },
    error: (err: any) => {
      this.isLoading = false;
      this.alert.error('Falha no Login', err.message);
    }
  });
}
}
