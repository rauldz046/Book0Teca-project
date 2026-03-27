import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FuncionariosLogados } from '../models/funcionarios.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  http = inject(HttpClient);
  url: string = 'http://localhost:4000/';

  BuscarFuncionarios() {
    const url = this.url + 'funcionarios/findAll';
    return this.http.get<FuncionariosLogados[]>(url);
  }
  CriarFuncionarios(data: any) {
    const url = this.url + 'funcionarios/create';
    return this.http.post<FuncionariosLogados>(url, data);
  }

  LoginValidation(data: any) {
    const url = this.url + 'funcionarios/login';
    return this.http.post<FuncionariosLogados>(url, data);
  }

  UpdateFuncionario(data: any) {
    const url = this.url + 'funcionarios/updateUser';
    return this.http.post<FuncionariosLogados>(url, data);
  }

  UpdateSenhaFuncionario(data: any) {
    const url = this.url + 'funcionarios/updatePassword';
    return this.http.post<any>(url, data);
  }

  UpdateStatusFuncionario(data: any) {
    const url = this.url + 'funcionarios/updateStatus';
    return this.http.post<any>(url, data);
  }

  DeleteFuncionario(id: number) {
    const url = this.url + `funcionarios/deleteUser`;
    return this.http.post<any>(url, id);
  }
}