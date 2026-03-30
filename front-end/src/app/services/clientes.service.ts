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

  BuscarUsuarioPorId(id: number) {
    const url = this.url + `usuarios/${id}`;
    return this.http.get<UsuariosLogados>(url);
  }

  CriarUsuario(data: any) {
    const url = this.url + 'usuarios/cretateUser';
    return this.http.post<UsuariosLogados>(url, data);
  }

  LoginValidation(data: any) {
    const url = this.url + 'usuarios/login';
    return this.http.post<UsuariosLogados>(url, data);
  }

  UpdateUsuario(data: any) {
    const url = this.url + 'usuarios/updateUser';
    return this.http.post<UsuariosLogados>(url, data);
  }

  UpdateSenhaUsuario(data: any) {
    const url = this.url + 'usuarios/updatePassword';
    return this.http.post<any>(url, data);
  }

  UpdateStatusUsuario(data: any) {
    const url = this.url + 'usuarios/updateStatus';
    return this.http.post<any>(url, data);
  }

  DeleteUsuario(id: number) {
    const url = this.url + `usuarios/deleteUser`;
    return this.http.post<any>(url, id);
  }
}