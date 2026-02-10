import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../models/clientes.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

http = inject(HttpClient)
url: string = 'http://localhost:3000/';


  BuscarUsuarios(){
    const url = this.url + 'clientes?tipo=Cliente'; 
    return this.http.get<Usuarios[]>(url) 
  }

  BuscarFornecedores(){
    const url = this.url + "clientes?tipo=Fornecedor"
    return this.http.get<Usuarios[]>(url)
  }
}
