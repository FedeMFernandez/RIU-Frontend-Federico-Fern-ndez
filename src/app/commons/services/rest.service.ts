
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first } from "rxjs";
import { environment } from "../../../environments/environment";


@Injectable({
    providedIn: 'root',
})
export class RestService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    async get<T>(endpoint: string): Promise<T> {
      return new Promise((resolve, reject) => {
          this.httpClient.get(this.urlCompose(endpoint), this.getHttpOptions()).pipe(first()).subscribe({
              next: this.successCallback<T>(resolve, reject),
              error: this.errorCallback(reject),
          })
      });
    }

    async post<T>(endpoint: string, body: any): Promise<T> {
      return new Promise((resolve, reject) => {
          this.httpClient.post(this.urlCompose(endpoint), body, this.getHttpOptions()).pipe(first()).subscribe({
              next: this.successCallback<T>(resolve, reject),
              error: this.errorCallback(reject),
          })
      });
    }

    async put<T>(endpoint: string, body: any): Promise<T> {
      return new Promise((resolve, reject) => {
          this.httpClient.put(this.urlCompose(endpoint), body, this.getHttpOptions()).pipe(first()).subscribe({
              next: this.successCallback<T>(resolve, reject),
              error: this.errorCallback(reject),
          })
      });
    }

    async delete<T>(endpoint: string): Promise<T> {
      return new Promise((resolve, reject) => {
          this.httpClient.delete(this.urlCompose(endpoint), this.getHttpOptions()).pipe(first()).subscribe({
              next: this.successCallback<T>(resolve, reject),
              error: this.errorCallback(reject),
          })
      });
    }

    private urlCompose(endpoint: string): string {
        return `${environment.apiURL}${endpoint}`;
    }

    private getHttpOptions(): Object {
      return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: false,
      }
    }

    private successCallback<T>(resolve: any, reject: any): (data: any) => void {
        return (data: any) => {
            try {
              resolve(data as T);
            } catch (error: any) {
              reject(error);
            }
        }
    }

    private errorCallback(reject: Function): (error: HttpErrorResponse) => void {
        return (error: HttpErrorResponse) => {
            reject(error);
        }
    }
}
