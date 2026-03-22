import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { UsuariosLogados } from '../../models/clientes.model';
import { inject } from '@angular/core';

@Component({
  selector: 'app-gerenciar-leitores',
  templateUrl: './gerenciar-leitores.component.html',
  styleUrls: ['./gerenciar-leitores.component.scss'],
})
export class GerenciarLeitoresComponent implements OnInit {
  ClienteService = inject(ClientesService);
  usuariosLogados!: UsuariosLogados;

  ngOnInit(): void {
    this.ClienteService.BuscarUsuarios().subscribe((res)=>{
      this.usuariosLogados = res[0];
      
    });
  }
}
