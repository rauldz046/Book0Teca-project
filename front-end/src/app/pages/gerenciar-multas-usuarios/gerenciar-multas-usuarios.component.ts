import { Component, inject } from '@angular/core';
import { Multa } from 'src/app/models/multas.model';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-gerenciar-multas-usuarios',
  templateUrl: './gerenciar-multas-usuarios.component.html',
  styleUrls: ['./gerenciar-multas-usuarios.component.scss'],
})
export class GerenciarMultasUsuariosComponent {
  MessageService = inject(MessageService);
  ConfirmationService = inject(ConfirmationService);
  AlertService = inject(AlertService);
  private authService = inject(AuthService);

  multas: Multa[] = [];
  multasUsuario: Multa[] = [];
  selectedMulta: Multa | null = null;
  displayDialog: boolean = false;
  loading: boolean = true;

  get isLeitor(): boolean {
    return this.authService.hasProfile(['LEITOR']);
  }

  get isFinanceiro(): boolean {
    return this.authService.hasProfile(['FINANCEIRO']);
  }

  ngOnInit() {
    // Simulando dados vindo de uma API
    this.multas = [
      {
        id: 1,
        usuario: 'João Silva',
        livro: 'Angular Avançado',
        dataVencimento: new Date(),
        valor: 15.5,
        status: 'PENDENTE',
        diasAtraso: 5,
      },
      {
        id: 2,
        usuario: 'Maria Souza',
        livro: 'Clean Code',
        dataVencimento: new Date(),
        valor: 25.0,
        status: 'PENDENTE',
        diasAtraso: 10,
      },
      {
        id: 3,
        usuario: 'João Silva',
        livro: 'Dom Casmurro',
        dataVencimento: new Date(),
        valor: 5.0,
        status: 'PAGO',
        diasAtraso: 2,
      },
    ];

    const nomeUsuario: string = this.authService.session?.nome ?? 'João Silva';
    this.multasUsuario = this.multas.filter((m) => m.usuario === nomeUsuario);
    this.loading = false;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'PAGO':
        return 'success';
      case 'PENDENTE':
        return 'danger';
      case 'CANCELADO':
        return 'info';
      default:
        return 'warning';
    }
  }

  receberPagamento(multa: Multa) {
    multa.status = 'PAGO';
    this.MessageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Pagamento registrado com sucesso!',
    });
  }

  abrirDetalhes(multa: Multa) {
    this.selectedMulta = multa;
    this.displayDialog = true;
  }
}
