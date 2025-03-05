import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingSignal } from "../signals/loading.signal";
import { finalize } from "rxjs";

export const LoadingInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingSignal = inject(LoadingSignal);
  loadingSignal.loading = true;

  return next(request).pipe(
    finalize(() => {
      loadingSignal.loading = false;
    })
  );
};
