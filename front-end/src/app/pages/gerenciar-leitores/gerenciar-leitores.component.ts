import { Component, OnInit, inject } from '@angular/core';
import { UsuariosLogados } from '../../models/clientes.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditClienteComponent } from './modal-edit-cliente/modal-edit-cliente.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlertService } from 'src/app/utils/toast-alert-service.service';
import { ClientesService } from 'src/app/services/Clientes.service';

@Component({
  selector: 'app-gerenciar-leitores',
  templateUrl: './gerenciar-leitores.component.html',
  styleUrls: ['./gerenciar-leitores.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class GerenciarLeitoresComponent implements OnInit {
  private clienteService = inject(ClientesService);
  private dialog         = inject(MatDialog);
  alert                  = inject(AlertService);
  private confirmationService = inject(ConfirmationService);

  usuariosLogados: UsuariosLogados[] = [];
  loading = true;

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.clienteService.BuscarUsuarios().subscribe({
      next: (res) => {
        this.usuariosLogados = res;
        this.loading = false;
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
      if (result) this.carregarUsuarios();
    });
  }

  toggleUserStatus(user: any): void {
    const isAtivo   = user.Status === 1;
    const acao      = isAtivo ? 'desativar' : 'ativar';
    const novoStatus = isAtivo ? 2 : 1; // 1=Ativo, 2=Inativo conforme banco

    this.confirmationService.confirm({
      message: `Deseja <b>${acao}</b> o leitor <b>${user.Nome}</b>?`,
      header: 'Alterar Status',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.clienteService
          .UpdateStatusUsuario({ idUsuario: user.idUsuario, idStatus: novoStatus })
          .subscribe({
            next: () => {
              user.Status = novoStatus;
              this.alert.success('Atualizado', `Usuário agora está ${isAtivo ? 'Inativo' : 'Ativo'}`);
            },
            error: () => this.alert.error('Erro', 'Falha ao atualizar status'),
          });
      },
    });
  }

  deleteUser(user: any): void {
    this.confirmationService.confirm({
      message: `Excluir <b>${user.Nome}</b>? Esta ação é irreversível.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.clienteService.DeleteUsuario(user.idUsuario).subscribe({
          next: () => {
            this.usuariosLogados = this.usuariosLogados.filter(
              (u) => u.idUsuario !== user.idUsuario,
            );
            this.alert.success('Excluído', 'Usuário removido com sucesso');
          },
          error: () => this.alert.error('Erro', 'Falha ao excluir usuário'),
        });
      },
    });
  }
}
