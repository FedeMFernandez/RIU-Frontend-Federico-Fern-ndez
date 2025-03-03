import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  private loadingSubject: Subject<boolean> = new Subject<boolean>();
  set loading(value: boolean) {
    this.loadingSubject.next(value);
  }
  get loading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  constructor() { }
}
