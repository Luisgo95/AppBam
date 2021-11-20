import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { getHeaders } from 'src/app/config/headers';
import { Urls } from 'src/app/config/utilitis';
import { IClientes } from './clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private recurso = Urls.CLIENTES;
  private url = Urls.URL_API

  constructor(
    private httpClient: HttpClient,

  ) { }



  async getAll() {
    return await this.httpClient.get(this.url + this.recurso, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }


  async new(cliente: IClientes) {
    const lDatos = JSON.stringify(cliente);
    return await this.httpClient.post(this.url + this.recurso, lDatos, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }

  async getById(id: any) {
    return await this.httpClient.get(this.url + this.recurso + '/' + id, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }


  async update(cliente: any, id: number) {
    const v = JSON.stringify(cliente);
    return await this.httpClient.put(this.url + this.recurso + '/' + id, v,
      { headers: getHeaders() })
      .pipe(map((data: any) => { return data; }))
      .toPromise();
  }


  async delete(id: number) {
    return await this.httpClient.delete(this.url + this.recurso + '/' + id,
      { headers: getHeaders() }).pipe(
        map((data: any) => {
          return data;
        })).toPromise();
  }

}
