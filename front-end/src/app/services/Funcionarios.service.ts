import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FuncionariosLogados } from '../models/funcionarios.model';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:4000/funcionarios';

  BuscarFuncionarios(): Observable<FuncionariosLogados[]> {
    return this.http.get<FuncionariosLogados[]>(`${this.BASE_URL}/findAll`);
  }

  BuscarFuncionarioPorId(id: number): Observable<FuncionariosLogados> {
    return this.http.get<FuncionariosLogados>(`${this.BASE_URL}/${id}`);
  }

  CriarFuncionario(data: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/create`, data);
  }

  LoginValidation(data: { email: string; senha: string }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/login`, data);
  }

  // CORRIGIDO: era '/funcionarios/updateUser' — rota não existia
  UpdateFuncionario(data: Partial<FuncionariosLogados> & { idFuncionario: number }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/update`, data);
  }

  UpdateSenhaFuncionario(data: { idFuncionario: number; SenhaFunc: string }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updatePassword`, data);
  }

  UpdateStatusFuncionario(data: { idFuncionario: number; idStatus: number }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updateStatus`, data);
  }

  // CORRIGIDO: era '/funcionarios/deleteUser' — rota não existia
  DeleteFuncionario(idFuncionario: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/delete`, { idFuncionario });
  }
}
