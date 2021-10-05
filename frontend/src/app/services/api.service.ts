import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
// @ts-ignore
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const BASE_URL = environment.BASE_URL;
const WEB_WORK_URL = environment.WEBWORK_BASE_URL
// ApiService is the base service for api requests
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public errorMessage: any;
  private options: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `*`
    })
  };

  private fileUploadOptions: object = {
    headers: new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': `*`,
    })
  }

  private downloadOptions: object = {
   /* responseType : 'blob',*/
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': `*`
    })
  }

  constructor(private httpClient: HttpClient) { }

  /**
   * Getting some data
   * @param path
   * @param params
   * @returns GET request body
   */
  public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(`${BASE_URL}${path}`, { params });
  }

  public downloadImage(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.post(`${BASE_URL}${path}`, {params}, {responseType: 'blob'});
  }

  /**
   * Creating or posting some data
   * @param path
   * @param body
   * @returns POST request body
   */
  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(`${BASE_URL}${path}`, JSON.stringify(body), this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Post files
   * @param path
   * @param body
   * @returns POST request body
   */

  public postFile(path: string, body: any): Observable<any> {
    const payload: FormData = new FormData();
    payload.append('file', body);
    return this.httpClient
      .post(`${BASE_URL}${path}`, payload, this.fileUploadOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Updating data
   * @param path
   * @param body
   * @returns PUT request body
   */
  public put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(`${BASE_URL}${path}`, JSON.stringify(body), this.options);
  }

  /**
   * Deleting data
   * @param path
   * @returns DELETE request body
   */
  public delete(path: string): Observable<any> {
    return this.httpClient.delete(`${BASE_URL}${path}`);
  }

  /**
   * Creating or posting some data to Web work
   * @param path
   * @param body
   * @returns POST request body
   */
  public postToWebWork(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(`${WEB_WORK_URL}${path}`, JSON.stringify(body), this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handling Errors
   * @param error
   * @returns error
   */
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
