import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmprestimoDB, RegistrarEmprestimoPayload, ConfirmarDevolucaoPayload, RespostaDevolucao } from '../models/emprestimos.model';

@Injectable({
  providedIn: 'root',
})
export class EmprestimosService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:4000/emprestimos';

  FindAll(): Observable<EmprestimoDB[]> {
    return this.http.get<EmprestimoDB[]>(`${this.BASE_URL}/findAll`);
  }

  FindById(id: number): Observable<EmprestimoDB> {
    return this.http.get<EmprestimoDB>(`${this.BASE_URL}/${id}`);
  }

  Registrar(data: RegistrarEmprestimoPayload): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/registrar`, data);
  }

  ConfirmarDevolucao(data: ConfirmarDevolucaoPayload): Observable<RespostaDevolucao> {
    return this.http.post<RespostaDevolucao>(`${this.BASE_URL}/devolver`, data);
  }
}
