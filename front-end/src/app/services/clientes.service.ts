import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosLogados } from '../models/clientes.model';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:4000/usuarios';

  BuscarUsuarios(): Observable<UsuariosLogados[]> {
    return this.http.get<UsuariosLogados[]>(`${this.BASE_URL}/findAll`);
  }

  BuscarUsuarioPorId(id: number): Observable<UsuariosLogados> {
    return this.http.get<UsuariosLogados>(`${this.BASE_URL}/${id}`);
  }

  // CORRIGIDO: era 'cretateUser' (typo)
  CriarUsuario(data: {
    payloadUser: any;
    payloadBanco: any;
    payloadEndereco: any;
  }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/createUser`, data);
  }

  LoginValidation(data: { email: string; senha: string }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, data);
  }

  UpdateUsuario(data: Partial<UsuariosLogados> & { idUsuario: number }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updateUser`, data);
  }

  UpdateSenhaUsuario(data: { idUsuario: number; Senha: string }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updatePassword`, data);
  }

  // CORRIGIDO: antes passava string; agora espera { idUsuario, idStatus }
  UpdateStatusUsuario(data: { idUsuario: number; idStatus: number }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updateStatus`, data);
  }

  // CORRIGIDO: antes passava id direto; agora passa { idUsuario }
  DeleteUsuario(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/deleteUser`, { idUsuario });
  }
}
