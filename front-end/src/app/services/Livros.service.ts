import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro, EntradaEstoque, FiltroBuscaLivro } from '../models/livros.model';
import { ApiService } from './core/api.service';

@Injectable({
  providedIn: 'root',
})
export class LivrosService {
  private api = inject(ApiService);
  private readonly ROOT = '/livros';

  FindAll(): Observable<Livro[]> {
    return this.api.get<Livro[]>(`${this.ROOT}/findAll`);
  }

  FindById(id: number): Observable<Livro> {
    return this.api.get<Livro>(`${this.ROOT}/${id}`);
  }

  // Busca com filtros — atende RF06
  Buscar(filtros: FiltroBuscaLivro): Observable<Livro[]> {
    let params = new HttpParams();
    if (filtros.titulo)  params = params.set('titulo', filtros.titulo);
    if (filtros.autorId) params = params.set('autorId', String(filtros.autorId));
    if (filtros.tipo)    params = params.set('tipo', filtros.tipo);
    return this.api.get<Livro[]>(`${this.ROOT}/buscar`, params);
  }

  Criar(data: Partial<Livro>): Observable<Livro> {
    return this.api.post<Livro>(`${this.ROOT}/create`, data);
  }

  Atualizar(data: Partial<Livro> & { idLivro: number }): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/update`, data);
  }

  // Entrada de lote de estoque — atende RF21
  EntradaEstoque(data: EntradaEstoque): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/estoque`, data);
  }

  Deletar(idLivro: number): Observable<any> {
    return this.api.post<any>(`${this.ROOT}/delete`, { idLivro });
  }
}
