import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FuncionariosLogados } from '../models/funcionarios.model';
import { ApiService } from './core/api.service';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private api = inject(ApiService);
  private readonly ROOT = '/funcionarios';

  BuscarFuncionarios(): Observable<FuncionariosLogados[]> {
    return this.api.get<FuncionariosLogados[]>(`${this.ROOT}/findAll`);
  }

  BuscarFuncionarioPorId(id: number): Observable<FuncionariosLogados> {
    return this.api.get<FuncionariosLogados>(`${this.ROOT}/${id}`);
  }

  CriarFuncionario(data: any): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/create`, data);
  }

  LoginValidation(data: { email: string; senha: string }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/login`, data);
  }

  /** TC-AUTH-06: solicita senha provisória por e-mail. */
  ResetPassword(data: { email: string }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/resetPassword`, data);
  }

  UpdateFuncionario(
    data:
      | (Partial<FuncionariosLogados> & { idFuncionario: number })
      | { payloadFuncionario: Partial<FuncionariosLogados> & { idFuncionario: number }; payloadEndereco?: any; payloadBanco?: any }
  ): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/update`, data);
  }

  UpdateSenhaFuncionario(data: { idFuncionario: number; SenhaFunc: string }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/updatePassword`, data);
  }

  UpdateStatusFuncionario(data: { idFuncionario: number; idStatus: number }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/updateStatus`, data);
  }

  DeleteFuncionario(idFuncionario: number): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/delete`, { idFuncionario });
  }
}
