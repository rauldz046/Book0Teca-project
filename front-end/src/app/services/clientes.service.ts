import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuariosLogados } from '../models/clientes.model';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  http = inject(HttpClient);
  url: string = 'http://localhost:4000/';

  BuscarUsuarios() {
    const url = this.url + 'usuarios/findAll';
    return this.http.get<UsuariosLogados[]>(url);
  }

  LoginValidation(data: any) {
    const url = this.url + 'usuarios/login';
    return this.http.post<UsuariosLogados>(url, data);
  }

  BuscarFornecedores() {
    const url = this.url + 'clientes?tipo=Fornecedor';
    return this.http.get<UsuariosLogados>(url);
  }

  UpdateUsuario(data: any) {
    const url = this.url + 'usuarios/updateUser';
    return this.http.post<UsuariosLogados>(url, data);
  }
}
