import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { UsuariosLogados } from '../../models/clientes.model';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditClienteComponent } from './modal-edit-cliente/modal-edit-cliente.component';

@Component({
  selector: 'app-gerenciar-leitores',
  templateUrl: './gerenciar-leitores.component.html',
  styleUrls: ['./gerenciar-leitores.component.scss'],
})
export class GerenciarLeitoresComponent implements OnInit {
  ClienteService = inject(ClientesService);
  dialogService = inject(MatDialog);
  usuariosLogados!:UsuariosLogados[];

  ngOnInit(): void {
    this.ClienteService.BuscarUsuarios().subscribe((res)=>{
      this.usuariosLogados = res; ;
    });
  }

  editUser(event: any) {
    const ctx = event;
    this.dialogService.open(ModalEditClienteComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container', 
      hasBackdrop: true,
      data: ctx,
      position: { top: '50px' },
    });

  }
  toggleUserStatus(user:any) {
  const acao = user.Ativo ? 'desativar' : 'ativar';
  const confirmacao = confirm(`Tem certeza que deseja ${acao} o leitor ${user.Nome}?`);

  if (confirmacao) {
    // Inverte o status localmente para refletir na UI imediatamente após o sucesso
    const novoStatus = !user.Ativo;

    // Chamada ao seu serviço (Exemplo)
    // Supondo que seu serviço tenha um método para atualizar apenas o status
    // this.ClienteService.AtualizarStatusUsuario(user.idUsuario, novoStatus).subscribe({
    //   next: () => {
    //     user.Ativo = novoStatus; // Atualiza a variável na lista para mudar o botão
    //     console.log(`Usuário ${user.Nome} atualizado com sucesso.`);
    //   },
    //   error: (err) => {
    //     console.error('Erro ao atualizar status', err);
    //     alert('Erro ao tentar mudar o status do usuário.');
    //   }
    // });
  }
}

  
  addNewUser() {
    // Aqui você pode abrir o mesmo modal, mas sem passar dados (data: null)
    this.dialogService.open(ModalEditClienteComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      data: null, // indica que é um novo cadastro
      position: { top: '50px' },
    });
  }

  deleteUser(user: UsuariosLogados) {
    // Exemplo de confirmação simples (você pode usar o p-confirmDialog do PrimeNG depois)
    const confirmacao = confirm(`Tem certeza que deseja excluir o leitor ${user.Nome}?`);
    if (confirmacao) {
      console.log('Deletando usuário:', user.idUsuario);
      // Chame seu serviço de deleção aqui
    }
  }



}
