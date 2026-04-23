import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Venda,
  RegistrarVendaPayload,
  RelatorioVendas,
} from '../models/vendas.model';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:4000/vendas';

  FindAll(): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.BASE_URL}/findAll`);
  }

  FindById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.BASE_URL}/${id}`);
  }

  // RF08 (físico) e RF09 (digital) — baixa de estoque automática no back
  Registrar(data: RegistrarVendaPayload): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/registrar`, data);
  }

  // RF27 — baixa manual de boleto/confirmação de pagamento
  ConfirmarPagamento(data: { idVenda: number; ValorPago: number }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/confirmarPagamento`, data);
  }

  // RF39 — cancelamento de pedido ainda não processado
  Cancelar(idVenda: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/cancelar`, { idVenda });
  }

  // RF30 — relatório de vendas por período
  Relatorio(dataInicio?: string, dataFim?: string): Observable<RelatorioVendas> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim)    params = params.set('dataFim', dataFim);
    return this.http.get<RelatorioVendas>(`${this.BASE_URL}/relatorio`, { params });
  }
}
