import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { getHeaders } from 'src/app/config/headers';
import { Urls } from 'src/app/config/utilitis';
import { ICotizacion } from './cotizaciones';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  private recurso = Urls.COTIZACIONES;
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

  async search(dato: string) {
    return await this.httpClient.get(this.url + this.recurso + '/search/' + dato, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }


  async new(cotizacion: ICotizacion) {
    const lDatos = JSON.stringify(cotizacion);
    return await this.httpClient.post(this.url + this.recurso, lDatos, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }

  async delete(id: number) {
    return await this.httpClient.delete(this.url + this.recurso + '/' + id, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }

  async getId(id: number) {
    return await this.httpClient.get(this.url + this.recurso + '/' + id, {
      headers: getHeaders()
    }).pipe(
      map((data: any) => {
        return data;
      })).toPromise();
  }

}
