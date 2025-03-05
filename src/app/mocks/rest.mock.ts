import { Injectable } from "@angular/core";
import { threadSleep } from 'src/app/shared/functions/thread-sleep.function';
import { LoadingSignal } from "../core/signals/loading.signal";

@Injectable({
    providedIn: 'root',
})
export class RestMock {

    constructor(
      private loadingSignal: LoadingSignal
    ) { }

    fakeQuery<T>(f: () => Promise<T>, delay: number): Promise<T> {
      return new Promise(async (resolve, reject) => {
        try {
          this.loadingSignal.loading = true;
          await threadSleep(delay);
          resolve(f())
        } catch (error: any) {
          reject(error);
        } finally {
          this.loadingSignal.loading = false;
        }
      });
    };
}
