import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import moment from 'moment';
import { of, throwError } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { RestService } from 'src/app/core/services/rest.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { HeroService, HeroModelDTO } from '../../services/hero.service';
import { Location } from '@angular/common';
import Formats from 'src/app/core/constants/formats.constants';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let restServiceSpy: jasmine.SpyObj<RestService>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;
  let activatedRouteSpy: any;
  let loadingService: LoadingService;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    restServiceSpy = jasmine.createSpyObj('RestService', ['get', 'post', 'put', 'delete']);
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['get', 'push', 'update', 'delete']);
    activatedRouteSpy = {
      snapshot: {
        paramMap: new Map([['id', '1']]),
      }
    };
    loadingService = new LoadingService();

    await TestBed.configureTestingModule({
      imports: [FormComponent],
      providers: [
        provideRouter([{
          path: 'heroes', component: {} as any,
        }]),
        provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RestService, useValue: restServiceSpy },
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: LoadingService, useValue: loadingService },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: Formats.MOMENT_DATE_FORMAT }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const expected: HeroModelDTO = <HeroModelDTO>{
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
      createdAt: 682743600,
    };
    httpClientSpy.get.and.returnValue(of(expected));
    restServiceSpy.get.and.returnValue(Promise.resolve(expected));
    heroServiceSpy.get.and.returnValue(Promise.resolve(expected));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show notification error while fetching heroe', async () => {
    const error = new Error('Error obteniendo heroe');
    httpClientSpy.get.and.returnValue(
      throwError(() => error)
    );
    restServiceSpy.get.and.returnValue(Promise.reject(error));
    heroServiceSpy.get.and.returnValue(Promise.reject(error));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);

    loadingService.loading = true;
    fixture.detectChanges();

    await expectAsync(heroServiceSpy.get()).toBeRejectedWith(error);
  });

  describe('submitEventHandler()', () => {
    it('should add hero', async () => {
      activatedRouteSpy.snapshot.paramMap = new Map();
      fixture.detectChanges();

      const expected: HeroModelDTO[] = [];
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      expected.push({
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      });
      httpClientSpy.post.and.returnValue(of(expected[0]));
      restServiceSpy.post.and.returnValue(Promise.resolve(expected[0]));
      heroServiceSpy.push.and.returnValue(Promise.resolve(expected[0]));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);

      const location = TestBed.inject(Location);

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);

      expect(heroServiceSpy.update).not.toHaveBeenCalled();
      expect(location.path()).toBe('/heroes');
    });

    it('should not add hero', async () => {
      activatedRouteSpy.snapshot.paramMap = new Map();
      fixture.detectChanges();

      const expected: HeroModelDTO[] = [];
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      expected.push({
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      });

      const error = new Error('No se pudo completar');

      httpClientSpy.post.and.returnValue(
        throwError(() => new Error('No se pudo completar'))
      );
      restServiceSpy.post.and.returnValue(Promise.reject(error));
      heroServiceSpy.push.and.returnValue(Promise.reject(error));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);

      expect(heroServiceSpy.update).not.toHaveBeenCalled();
    });

     it('should update hero', async () => {
      fixture.detectChanges();

      let expected: HeroModelDTO[] = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      }];
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      expected = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Dual core',
        birth: 682743600,
        createdAt: 682743600,
      }];
      httpClientSpy.put.and.returnValue(of(expected[0]));
      restServiceSpy.put.and.returnValue(Promise.resolve(expected[0]));
      heroServiceSpy.update.and.returnValue(Promise.resolve(expected[0]));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);
      const location = TestBed.inject(Location);

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Dual core',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);

      expect(location.path()).toBe('/heroes');
    });

    it('should not update hero', async () => {
      fixture.detectChanges();

      let expected: HeroModelDTO[] = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      }];
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      const error = new Error('No se pudo completar')
      httpClientSpy.put.and.returnValue(throwError(() => error));
      restServiceSpy.put.and.returnValue(Promise.reject(error));
      heroServiceSpy.update.and.returnValue(Promise.reject(error));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Dual core',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);

      await expectAsync(heroServiceSpy.update(1, formValue)).toBeRejectedWith(error);
    });
  });

  describe('deleteEventHandler()', () => {
    it('should delete Hero', async ()  => {
      fixture.detectChanges();
      const expected: HeroModelDTO = {
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      const location = TestBed.inject(Location);
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      heroServiceSpy.delete.and.returnValue(Promise.resolve());

      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler();
      expect(location.path()).toBe('/heroes');
    });

    it('should not delete Hero if its not edition', async ()  => {
      activatedRouteSpy.snapshot.paramMap = new Map();
      fixture.detectChanges();

      const expected: HeroModelDTO = {
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      await component.deleteEventHandler();
      expect(heroServiceSpy.get).not.toHaveBeenCalled();
    });

    it('should not delete Hero because of cancelation', async ()  => {
      fixture.detectChanges();
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: false }));

      await component.deleteEventHandler();

      expect(Swal.fire).toHaveBeenCalled();
    });

    it('should not delete Hero because of error', async ()  => {
      fixture.detectChanges();
      const expected: HeroModelDTO = {
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      httpClientSpy.get.and.returnValue(of(expected));
      restServiceSpy.get.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      const error = new Error('Error al borrar héroe');

      httpClientSpy.delete.and.returnValue(of());
      restServiceSpy.delete.and.returnValue(Promise.reject(error));
      heroServiceSpy.delete.and.returnValue(Promise.reject(error));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));
      await component.deleteEventHandler();

      expect(Swal.fire).toHaveBeenCalled();
    });
  });

});
