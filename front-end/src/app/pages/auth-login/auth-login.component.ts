import { ClientesService } from 'src/app/services/clientes.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosLogados } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent implements OnInit {
  private router = inject(Router);
  private ClienteService = inject(ClientesService);
  sessaoUser!: UsuariosLogados;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    senha: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  async submit() {
    const infoUser = this.form.getRawValue();

    this.ClienteService.LoginValidation(infoUser).subscribe((res) => {
      if (!res) {
        alert('Usuário ou Senha Incorretos');
        return;
      }

      this.sessaoUser = res;
      this.router.navigate(['/home']);
    });
  }
}
