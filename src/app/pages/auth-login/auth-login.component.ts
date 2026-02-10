import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
})
export class AuthLoginComponent {
  private router = inject(Router);

  Email = new FormControl('', [Validators.required, Validators.email]);
  Senha = new FormControl('', [Validators.required]);

  Submit() {
    if (
      this.Email.value == 'raul.7lmg@gmail.com' &&
      this.Senha.value == '0000000000*'
    ) {
      this.router.navigate(['/home']);
      return;
    }
    alert('Email ou senha inválidos');
  }
}
