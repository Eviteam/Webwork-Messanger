import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
// @ts-ignore
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const BASE_URL = environment.BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public errorMessage: any;
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `*`
    })
  };

  constructor(private httpClient: HttpClient) { }

  public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(`${BASE_URL}${path}`, { params });
  }

  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(`${BASE_URL}${path}`, JSON.stringify(body), this.options)
      .pipe(
        tap(_ => this.log('login')),
        catchError(this.handleError)
      );
  }

  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(`${BASE_URL}${path}`, JSON.stringify(body), this.options);
  }

  public delete(path: string): Observable<any> {
    return this.httpClient.delete(`${BASE_URL}${path}`);
  }

  private log(message: string) {
    console.log(message);
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
