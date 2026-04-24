import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Venda,
  RegistrarVendaPayload,
  RelatorioVendas,
} from '../models/vendas.model';
import { ApiService } from './core/api.service';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  private api = inject(ApiService);
  private readonly ROOT = '/vendas';

  FindAll(): Observable<Venda[]> {
    return this.api.get<Venda[]>(`${this.ROOT}/findAll`);
  }

  FindById(id: number): Observable<Venda> {
    return this.api.get<Venda>(`${this.ROOT}/${id}`);
  }

  // RF08 (físico) e RF09 (digital) — baixa de estoque automática no back
  Registrar(data: RegistrarVendaPayload): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/registrar`, data);
  }

  // RF27 — baixa manual de boleto/confirmação de pagamento
  ConfirmarPagamento(data: { idVenda: number; ValorPago: number }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/confirmarPagamento`, data);
  }

  // RF39 — cancelamento de pedido ainda não processado
  Cancelar(idVenda: number): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/cancelar`, { idVenda });
  }

  // RF30 — relatório de vendas por período
  Relatorio(dataInicio?: string, dataFim?: string): Observable<RelatorioVendas> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim)    params = params.set('dataFim', dataFim);
    return this.api.get<RelatorioVendas>(`${this.ROOT}/relatorio`, params);
  }
}
