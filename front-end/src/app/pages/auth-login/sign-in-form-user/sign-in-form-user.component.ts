import { AlertService } from './../../../utils/toast-alert-service.service';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/services/Clientes.service';

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
  fb = inject(FormBuilder);
  alert = inject(AlertService);
  clienteService = inject(ClientesService);
  router = inject(Router);

  ngOnInit() {
    this.items = [
      { label: 'Perfil' },
      { label: 'Endereço' },
      { label: 'Financeiro' },
    ];

    this.registerForm = new FormGroup({
      // UsuariosSistema
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cpf: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),

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
      codigoPix: new FormControl(''),
    });
  }

  nextStep() {
    if (this.activeIndex < 2) this.activeIndex++;
  }
  prevStep() {
    if (this.activeIndex > 0) this.activeIndex--;
  }

  async submit() {
    // if (this.registerForm.valid) {
      const alert =  await this.alert.info(
        'Termos e Condições',
        `Ao criar sua conta, você declara estar ciente e de acordo com nossos Termos de Uso e Política de Privacidade.
Seus dados pessoais serão coletados e tratados em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
As informações fornecidas serão utilizadas exclusivamente para fins de cadastro, autenticação e uso dos serviços disponibilizados na plataforma.
Podemos solicitar dados como nome, e-mail, telefone e outras informações necessárias para a correta identificação do usuário.
Esses dados não serão compartilhados com terceiros sem o seu consentimento, exceto quando exigido por obrigação legal.
Adotamos medidas técnicas e administrativas adequadas para proteger suas informações contra acesso não autorizado.
Você poderá, a qualquer momento, solicitar a atualização, correção ou exclusão de seus dados pessoais.
O uso da plataforma implica na concordância com o tratamento das informações conforme descrito neste aviso.
Seus dados serão armazenados apenas pelo período necessário para cumprir as finalidades informadas.
O acesso às suas informações será restrito a pessoas autorizadas e devidamente capacitadas.
Caso haja alterações nos termos ou na política de privacidade, você será informado pelos meios disponíveis.
É de responsabilidade do usuário fornecer dados verdadeiros e manter suas informações atualizadas.
Você também concorda em utilizar a plataforma de forma lícita, respeitando as normas vigentes.
Ao prosseguir com o cadastro, você confirma que leu e compreendeu estas condições.
Se não concordar com estes termos, recomendamos não concluir o processo de criação da conta.
`,
      );
      if (!alert.isConfirmed) {
        return;
      }

      const payloadUser = {
        Nome: this.registerForm.value.nome,
        CPF: this.registerForm.value.cpf,
        Telefone: this.registerForm.value.telefone,
        Email: this.registerForm.value.email,
        Senha: this.registerForm.value.senha,
        Nacionalidade: this.registerForm.value.nacionalidade,
        SenhaInicial: 0,
      };

      const payloadBanco = {
        NomeBanco: this.registerForm.value.nomeBanco,
        CodigoBanco: this.registerForm.value.codigoBanco,
        TipoConta: this.registerForm.value.tipoConta,
        NumeroAgencia: this.registerForm.value.numeroAgencia,
        DigitoAgencia: this.registerForm.value.digitoAgencia,
        NumeroConta: this.registerForm.value.numeroConta,
        DigitoConta: this.registerForm.value.digitoConta,
        CodigoPix: this.registerForm.value.codigoPix,
      };

      const payloadEndereco = {
        Logradouro: this.registerForm.value.logradouro,
        Bairro: this.registerForm.value.bairro,
        Numero: this.registerForm.value.numero,
        Cidade: this.registerForm.value.cidade,
        Estado: this.registerForm.value.estado,
        CEP: this.registerForm.value.cep,
        Complemento: this.registerForm.value.complemento,
      };

      const _data = {
        payloadBanco,
        payloadEndereco,
        payloadUser,
      };
      this.clienteService.CriarUsuario(_data).subscribe(async (res) => {
        if (res) {
          const confirm = await this.alert.success(
            'Conta criada!',
            ' Vocês já pode fazer login.',
          );
          if (confirm.isConfirmed) {
            this.router.navigate(['auth/log-in']);
          }
        }
      });
    }
  }
// }
