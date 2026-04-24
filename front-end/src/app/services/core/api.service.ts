import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Serviço central de comunicação HTTP.
 * Centraliza a BASE_URL (definida em environment.ts) para que os services
 * de domínio só precisem informar o path relativo (ex: '/usuarios/findAll').
 *
 * Para alternar entre back-end real e mock, edite src/environments/environment.ts.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private buildUrl(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalized}`;
  }

  get<T>(path: string, params?: HttpParams | Record<string, string | number | boolean>): Observable<T> {
    const httpParams = params instanceof HttpParams ? params : this.toHttpParams(params);
    return this.http.get<T>(this.buildUrl(path), { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path));
  }

  private toHttpParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
