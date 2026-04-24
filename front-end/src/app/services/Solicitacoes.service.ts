import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Solicitacao,
  TipoSolicitacao,
  EtapaSolicitacao,
  CriarSolicitacaoPayload,
} from '../models/solicitacoes.model';
import { ApiService } from './core/api.service';

@Injectable({
  providedIn: 'root',
})
export class SolicitacoesService {
  private api = inject(ApiService);
  private readonly ROOT = '/solicitacoes';

  FindAll(): Observable<Solicitacao[]> {
    return this.api.get<Solicitacao[]>(`${this.ROOT}/findAll`);
  }

  FindById(id: number): Observable<Solicitacao> {
    return this.api.get<Solicitacao>(`${this.ROOT}/${id}`);
  }

  FindTipos(): Observable<TipoSolicitacao[]> {
    return this.api.get<TipoSolicitacao[]>(`${this.ROOT}/tipos`);
  }

  FindEtapas(): Observable<EtapaSolicitacao[]> {
    return this.api.get<EtapaSolicitacao[]>(`${this.ROOT}/etapas`);
  }

  Criar(data: CriarSolicitacaoPayload): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/criar`, data);
  }

  AvancarEtapa(idSolicitacao: number): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/avancar`, { idSolicitacao });
  }

  Cancelar(idSolicitacao: number): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/cancelar`, { idSolicitacao });
  }
}
