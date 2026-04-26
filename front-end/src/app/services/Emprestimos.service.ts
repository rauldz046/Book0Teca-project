import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmprestimoDB, RegistrarEmprestimoPayload, ConfirmarDevolucaoPayload, RespostaDevolucao } from '../models/emprestimos.model';
import { ApiService } from './core/api.service';

@Injectable({
  providedIn: 'root',
})
export class EmprestimosService {
  private api = inject(ApiService);
  private readonly ROOT = '/emprestimos';

  FindAll(): Observable<EmprestimoDB[]> {
    return this.api.get<EmprestimoDB[]>(`${this.ROOT}/findAll`);
  }

  FindById(id: number): Observable<EmprestimoDB> {
    return this.api.get<EmprestimoDB>(`${this.ROOT}/${id}`);
  }

  Registrar(data: RegistrarEmprestimoPayload): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/registrar`, data);
  }

  Solicitar(data: { idLivro: number; idUser: number }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/solicitar`, data);
  }

  Autorizar(data: { idEmprestimo: number; AutorizadoPor: number }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/autorizar`, data);
  }

  ConfirmarDevolucao(data: ConfirmarDevolucaoPayload): Observable<RespostaDevolucao> {
    return this.api.post<RespostaDevolucao>(`${this.ROOT}/devolver`, data);
  }
}
