import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import Formats from './core/constants/formats.constants';
import 'moment/locale/es';
import moment from 'moment';

function appInitializer(dateAdepter: DateAdapter<MomentDateAdapter>): Function {
  return () => {
    moment.locale('es');
    dateAdepter.setLocale(moment.locale());
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        LoadingInterceptor,
      ]),
    ),
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [DateAdapter] },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: Formats.MOMENT_DATE_FORMAT },
  ],
};
