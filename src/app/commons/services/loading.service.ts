
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  private _loading: Subject<boolean> = new Subject<boolean>();
  set loading(value: boolean) {
    this._loading.next(value);
  }
  get loading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  constructor() { }
}
