import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuariosLogados } from '../models/clientes.model';
import { ApiService } from './core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private api = inject(ApiService);
  private readonly ROOT = '/usuarios';

  BuscarUsuarios(): Observable<UsuariosLogados[]> {
    return this.api.get<UsuariosLogados[]>(`${this.ROOT}/findAll`);
  }

  BuscarUsuarioPorId(id: number): Observable<UsuariosLogados> {
    return this.api.get<UsuariosLogados>(`${this.ROOT}/${id}`);
  }

  CriarUsuario(data: {
    payloadUser: any;
    payloadBanco: any;
    payloadEndereco: any;
  }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/createUser`, data);
  }

  LoginValidation(data: { email: string; senha: string }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/login`, data);
  }

  /** TC-AUTH-06: solicita senha provisória por e-mail. */
  ResetPassword(data: { email: string }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/resetPassword`, data);
  }

  UpdateUsuario(
    data:
      | (Partial<UsuariosLogados> & { idUsuario: number })
      | { payloadUser: Partial<UsuariosLogados> & { idUsuario: number }; payloadEndereco?: any; payloadBanco?: any }
  ): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/updateUser`, data);
  }

  UpdateSenhaUsuario(data: { idUsuario: number; Senha: string }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/updatePassword`, data);
  }

  UpdateStatusUsuario(data: { idUsuario: number; idStatus: number }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/updateStatus`, data);
  }

  DeleteUsuario(idUsuario: number): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/deleteUser`, { idUsuario });
  }
}
