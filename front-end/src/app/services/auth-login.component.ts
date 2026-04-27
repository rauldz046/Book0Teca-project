import { FuncionariosService } from 'src/app/services/Funcionarios.service';
import { ClientesService } from 'src/app/services/Clientes.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { UsuariosLogados } from 'src/app/models/clientes.model';
import { catchError, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
  private auth = inject(AuthService);

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

  this.clienteService.LoginValidation(infoUser).pipe(
    switchMap(res => {
      if (!res) return this.funcionarioService.LoginValidation(infoUser);
      return of(res);
    }),
    catchError(err => {
      return this.funcionarioService.LoginValidation(infoUser);
    })
  ).subscribe({
    next: (res: any) => {
      this.isLoading = false;

      if (res && res.infoSessao) {
        this.auth.setSession(res.infoSessao);

        // TC-AUTH-04: se SenhaInicial=true, força troca antes de prosseguir.
        // Cobrimos os dois nomes de campo (Usuário vs Funcionário).
        const sess = res.infoSessao;
        if (sess.SenhaInicial === true || sess.SenhaInicialFunc === true) {
          this.alert.info(
            'Atenção',
            'Você precisa trocar sua senha provisória antes de continuar.'
          );
          this.router.navigate(['/config/perfil'], {
            queryParams: { trocarSenha: 1 },
          });
          return;
        }

        this.router.navigate(['/home']);
      } else {
        this.alert.error('Erro', 'Usuário ou senha inválidos');
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.alert.error('Erro', 'Usuário não encontrado em nenhuma base.');
    }
  });
}

  /**
   * TC-AUTH-06: pede e-mail via SweetAlert e dispara reset de senha.
   * Tenta primeiro como cliente; em 404, tenta como funcionário.
   * Em dev/homologação o backend devolve a senha provisória no payload —
   * em produção, trocar essa exibição por "Verifique seu e-mail".
   */
  onForgotPassword(event?: Event) {
    if (event) event.preventDefault();

    Swal.fire({
      title: 'Recuperar senha',
      input: 'email',
      inputLabel: 'Informe o e-mail cadastrado',
      inputPlaceholder: 'voce@exemplo.com',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'E-mail obrigatório';
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        return ok ? null : 'E-mail inválido';
      },
    }).then((r) => {
      if (!r.isConfirmed || !r.value) return;

      const email = r.value;
      this.clienteService.ResetPassword({ email }).pipe(
        catchError(() => this.funcionarioService.ResetPassword({ email })),
      ).subscribe({
        next: (res: any) => {
          // Em produção, NÃO mostrar a senha — apenas confirmar envio por e-mail.
          if (res?.senhaProvisoria) {
            this.alert.info(
              'Senha provisória gerada',
              `Sua nova senha é: ${res.senhaProvisoria}. Você precisará trocá-la no próximo login.`
            );
          } else {
            this.alert.info(
              'Verifique seu e-mail',
              'Enviamos instruções para recuperar sua senha.'
            );
          }
        },
        error: () => {
          this.alert.error('Erro', 'Não foi possível recuperar a senha. Verifique o e-mail informado.');
        },
      });
    });
  }
}
