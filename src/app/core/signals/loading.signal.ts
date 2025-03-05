import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingSignal {

  private readonly _loading: WritableSignal<boolean> = signal(false);
  set loading(value: boolean) {
    this._loading.set(value);
  }
  get loading(): Signal<boolean> {
    return this._loading.asReadonly();
  }
}
