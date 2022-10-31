import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  get params() {
    return new HttpParams().set('fields', 'name,alpha3Code');
  }

  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    return this.http.get<PaisSmall[]>(
      `${environment.HOST_URL}/region/${region}`,
      {
        params: this.params,
      }
    );
  }

  getPaisPorCodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null);
    }

    return this.http.get<Pais>(`${environment.HOST_URL}/alpha/${codigo}`);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    return this.http.get<PaisSmall>(`${environment.HOST_URL}/alpha/${codigo}`, {
      params: this.params,
    });
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach((codigo) => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
