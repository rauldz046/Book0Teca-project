import { Component, OnInit, inject } from '@angular/core';
import { ClientesService } from 'src/app/services/Clientes.service';
import { UsuariosLogados } from '../../models/clientes.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditClienteComponent } from './modal-edit-cliente/modal-edit-cliente.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlertService } from 'src/app/utils/toast-alert-service.service';

@Component({
  selector: 'app-gerenciar-leitores',
  templateUrl: './gerenciar-leitores.component.html',
  styleUrls: ['./gerenciar-leitores.component.scss'],
  providers: [ConfirmationService, MessageService], // Providers locais para serviços do PrimeNG
})
export class GerenciarLeitoresComponent implements OnInit {
  private clienteService = inject(ClientesService);
  private dialog = inject(MatDialog);
  alert = inject(AlertService);
  private confirmationService = inject(ConfirmationService);

  usuariosLogados: UsuariosLogados[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.clienteService.BuscarUsuarios().subscribe({
      next: (res) => {
        this.usuariosLogados = res;
        this.loading = false;
        console.log(this.usuariosLogados);
      },
      error: () => {
        this.alert.error('Erro', 'Falha ao carregar usuários');
        this.loading = false;
      },
    });
  }

  openModal(user?: UsuariosLogados): void {
    const dialogRef = this.dialog.open(ModalEditClienteComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      data: user || null,
      position: { top: '50px' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.carregarUsuarios(); // Recarrega a lista se houver alteração
    });
  }

  toggleUserStatus(user: any): void {
    const isAtivo = user.Status === 1;
    const acao = isAtivo ? 'desativar' : 'ativar';

    this.confirmationService.confirm({
      message: `Tem certeza que deseja <b>${acao}</b> o leitor <b>${user.Nome}</b>?`,
      header: 'Alterar Status',
      icon: 'pi pi-exclamation-alt',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Lógica para refletir a mudança no Front antes/durante a chamada de API
        const novoStatus = isAtivo ? 0 : 1;
        const novaDescricao = isAtivo ? 'Inativo' : 'Ativo';
        const payload = { idUsuario: user.idUsuario, Status: novoStatus };

        this.clienteService.UpdateStatusUsuario(novaDescricao).subscribe({
          next: (res) => {
            if (res) {
              if (res.mensagem === 'success') {
                this.alert.success(
                  'Atualizado',
                  `O usuário agora está ${novaDescricao}`,
                );
              }
            }
          },
          error: () => {
            this.alert.error(
              'Erro',
              'Falha ao atualizar status do usuário',
            );
          },
        });

        this.alert.success(
          'Atualizado',
          `O usuário agora está ${novaDescricao}`,
        );
      },
    });
  }

  deleteUser(user: any): void {
    this.confirmationService.confirm({
      message: `Você está prestes a excluir <b>${user.Nome}</b>. Esta ação é irreversível. Deseja continuar?`,
      header: 'Confirmar Exclusão Crítica',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // Chama serviço de delete
        this.usuariosLogados = this.usuariosLogados.filter(
          (u) => u.idUsuario !== user.idUsuario,
        );
        this.alert.success(
          'Excluído',
          'Usuário removido da base de dados',
        );
      },
    });
  }
}
