import { ClientesService } from 'src/app/services/clientes.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosLogados } from 'src/app/models/clientes.model';
import { ToastService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit {
  private router = inject(Router);
  private clienteService = inject(ClientesService); // Corrigido para camelCase (padrão TS)
  private alert = inject(ToastService);

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

    // 2. Correção na sintaxe do subscribe
    this.clienteService.LoginValidation(infoUser).subscribe({
      next: (res: UsuariosLogados) => {
        if (res !== null) {
          this.router.navigate(['/home']);
        } else {
          this.isLoading = false;
          const msg = 'E-mail ou senha incorretos.';
          this.alert.toastDanger(msg);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.alert.dialogErro('Falha no Login', err.message).subscribe();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
