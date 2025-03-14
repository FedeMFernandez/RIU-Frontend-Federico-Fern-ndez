import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import Formats from './core/constants/formats.constants';
import 'moment/locale/es';
import moment from 'moment';

function appSetLocale(locale: string): Function {
  return (dateAdepter: DateAdapter<MomentDateAdapter>) => {
    return () => {
      moment.locale(locale);
      dateAdepter.setLocale(locale);
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: APP_INITIALIZER, useFactory: appSetLocale('es'), multi: true, deps: [DateAdapter] },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: Formats.MOMENT_DATE_FORMAT },
  ],
};
