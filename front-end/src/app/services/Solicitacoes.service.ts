import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Solicitacao,
  TipoSolicitacao,
  EtapaSolicitacao,
  CriarSolicitacaoPayload,
} from '../models/solicitacoes.model';

@Injectable({
  providedIn: 'root',
})
export class SolicitacoesService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:4000/solicitacoes';

  FindAll(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.BASE_URL}/findAll`);
  }

  FindById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.BASE_URL}/${id}`);
  }

  FindTipos(): Observable<TipoSolicitacao[]> {
    return this.http.get<TipoSolicitacao[]>(`${this.BASE_URL}/tipos`);
  }

  FindEtapas(): Observable<EtapaSolicitacao[]> {
    return this.http.get<EtapaSolicitacao[]>(`${this.BASE_URL}/etapas`);
  }

  Criar(data: CriarSolicitacaoPayload): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/criar`, data);
  }

  AvancarEtapa(idSolicitacao: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/avancar`, { idSolicitacao });
  }

  Cancelar(idSolicitacao: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/cancelar`, { idSolicitacao });
  }
}
