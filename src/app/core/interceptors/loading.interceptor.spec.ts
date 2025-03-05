import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { first, of } from 'rxjs';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingSignal } from '../signals/loading.signal';
import { computed, Signal } from '@angular/core';

describe('LoadingInterceptor', () => {

  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => LoadingInterceptor(req, next));
  let loadingSignal: LoadingSignal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
      ],
    });

    loadingSignal = TestBed.inject(LoadingSignal);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should start loading when intercept query', fakeAsync(() => {
    const httpRequest = new HttpRequest<any>('GET', 'http://localhost:4200');
    const handlerFn: HttpHandlerFn = (req: HttpRequest<any>) => {
      return of(new HttpResponse<any>({ status: 200, statusText: 'OK' }));
    };

    let loading: Signal<boolean> = computed(() => loadingSignal.loading());

    const observable = interceptor(httpRequest, handlerFn);
    const result = observable.pipe(first());

    result.subscribe(() => {
      expect(loading()).toBeTrue();
    })
  }));
});
