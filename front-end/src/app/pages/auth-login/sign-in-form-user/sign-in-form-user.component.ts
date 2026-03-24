import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sign-in-form-user',
  templateUrl: './sign-in-form-user.component.html',
  styleUrls: ['./sign-in-form-user.component.scss'],
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(30px)',
          position: 'absolute',
          width: '100%',
        }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms ease-in',
          style({
            opacity: 0,
            transform: 'translateX(-30px)',
            position: 'absolute',
            width: '100%',
          }),
        ),
      ]),
    ]),
  ],
})
export class SignInFormUserComponent {
  registerForm!: FormGroup;
  activeIndex: number = 0;
  items: MenuItem[] = [];
  mostrarSignIn = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.items = [{ label: 'Perfil' }, { label: 'Endereço' }, { label: 'Financeiro' }];

    this.registerForm = new FormGroup({
      // UsuariosSistema
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cpf: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      
      // InfoEndereco
      logradouro: new FormControl('', [Validators.required]),
      bairro: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      cidade: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
      cep: new FormControl('', [Validators.required]),
      nacionalidade: new FormControl('Brasileiro'),
      complemento: new FormControl(''),

      // InfoBancario
      nomeBanco: new FormControl(''),
      codigoBanco: new FormControl(''),
      tipoConta: new FormControl(''),
      numeroAgencia: new FormControl(''),
      digitoAgencia: new FormControl(''),
      numeroConta: new FormControl(''),
      digitoConta: new FormControl(''),
      codigoPix: new FormControl('')
    });
  }

  nextStep() { if (this.activeIndex < 2) this.activeIndex++; }
  prevStep() { if (this.activeIndex > 0) this.activeIndex--; }
  
  submit() {
    if (this.registerForm.valid) {
      console.log('Dados formatados para o SQL:', this.registerForm.value);
    }
  }
}