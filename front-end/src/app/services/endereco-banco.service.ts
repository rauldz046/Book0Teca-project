import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './core/api.service';
import { InfoBancario, InfoEndereco } from '../models/endereco-banco.model';

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private api = inject(ApiService);

  findAll(): Observable<InfoEndereco[]> {
    return this.api.get<InfoEndereco[]>('/enderecos/findAll');
  }
  findById(id: number): Observable<InfoEndereco> {
    return this.api.get<InfoEndereco>(`/enderecos/${id}`);
  }
  create(data: InfoEndereco): Observable<InfoEndereco> {
    return this.api.post<InfoEndereco>('/enderecos/create', data);
  }
  update(data: InfoEndereco & { idInfoEnd: number }): Observable<InfoEndereco> {
    return this.api.post<InfoEndereco>('/enderecos/update', data);
  }
}

@Injectable({ providedIn: 'root' })
export class BancoService {
  private api = inject(ApiService);

  findAll(): Observable<InfoBancario[]> {
    return this.api.get<InfoBancario[]>('/bancos/findAll');
  }
  findById(id: number): Observable<InfoBancario> {
    return this.api.get<InfoBancario>(`/bancos/${id}`);
  }
  create(data: InfoBancario): Observable<InfoBancario> {
    return this.api.post<InfoBancario>('/bancos/create', data);
  }
  update(data: InfoBancario & { IdInfoBancario: number }): Observable<InfoBancario> {
    return this.api.post<InfoBancario>('/bancos/update', data);
  }
}
