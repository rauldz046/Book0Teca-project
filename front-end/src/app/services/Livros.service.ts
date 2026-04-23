import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro, EntradaEstoque, FiltroBuscaLivro } from '../models/livros.model';

@Injectable({
  providedIn: 'root',
})
export class LivrosService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:4000/livros';

  FindAll(): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.BASE_URL}/findAll`);
  }

  FindById(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.BASE_URL}/${id}`);
  }

  // Busca com filtros — atende RF06
  Buscar(filtros: FiltroBuscaLivro): Observable<Livro[]> {
    let params = new HttpParams();
    if (filtros.titulo)  params = params.set('titulo', filtros.titulo);
    if (filtros.autorId) params = params.set('autorId', String(filtros.autorId));
    if (filtros.tipo)    params = params.set('tipo', filtros.tipo);
    return this.http.get<Livro[]>(`${this.BASE_URL}/buscar`, { params });
  }

  Criar(data: Partial<Livro>): Observable<Livro> {
    return this.http.post<Livro>(`${this.BASE_URL}/create`, data);
  }

  Atualizar(data: Partial<Livro> & { idLivro: number }): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/update`, data);
  }

  // Entrada de lote de estoque — atende RF21
  EntradaEstoque(data: EntradaEstoque): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/estoque`, data);
  }

  Deletar(idLivro: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/delete`, { idLivro });
  }
}
