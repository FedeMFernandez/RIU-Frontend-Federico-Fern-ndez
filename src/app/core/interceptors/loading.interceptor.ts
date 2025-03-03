import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingService } from "../services/loading.service";
import { finalize } from "rxjs";

export const LoadingInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);
  loadingService.loading = true;

  return next(request).pipe(
    finalize(() => {
      loadingService.loading = false;
    })
  );
};
