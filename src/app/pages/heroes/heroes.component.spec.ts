import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroesComponent } from './heroes.component';
import { provideRouter } from '@angular/router';
import { RestService } from 'src/app/commons/services/rest.service';
import { HttpClient } from '@angular/common/http';
import { routes } from './heroes.routes';
import { HeroModelDTO, HeroService } from 'src/app/commons/services/hero.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let restServiceSpy: jasmine.SpyObj<RestService>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete']);
    restServiceSpy = jasmine.createSpyObj('RestService', ['get', 'delete']);
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['get', 'delete']);

    await TestBed.configureTestingModule({
      imports: [
        HeroesComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter(routes),
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RestService, useValue: restServiceSpy },
        { provide: HeroService, useValue: heroServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should try to search hero with no value', async () => {
    const expected: HeroModelDTO[] = [{
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

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const inputSearch = fixture.debugElement.query(By.css('input'));
    inputSearch.triggerEventHandler('ngModelChange', 'Maxi');
    expect(component.dataSource.data).toEqual([]);
  });

  it('should try to search hero with value', async () => {
    const expected: HeroModelDTO[] = [{
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

    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const inputSearch = fixture.debugElement.query(By.css('input'));
    inputSearch.triggerEventHandler('ngModelChange', '');
    expect(component.dataSource.data).toEqual(expected);
  });

  describe('fetchList()', () => {
    it('should fetch empty list', ()  => {
      httpClientSpy.get.and.returnValue(of([]));
      restServiceSpy.get.and.returnValue(Promise.resolve([]));
      heroServiceSpy.get.and.returnValue(Promise.resolve([]));

      expect(component.heroes).toEqual([]);
    });

    it('should fetch non empty list', async ()  => {
      const expected: HeroModelDTO[] = [{
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

      await component.ngOnInit();

      expect(component.heroes).toEqual(expected);
    });

    it('should throw response error', async ()  => {
      const error = new Error('Error al obtener heroes')
      httpClientSpy.get.and.returnValue(
        throwError(() => error)
      );
      restServiceSpy.get.and.returnValue(Promise.reject(error));

      await component.ngOnInit();

      expect(component.heroes).toEqual([]);
    });
  });

  describe('deleteEventHandler()', () => {
    it('should delete Hero', async ()  => {
      component.heroes = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      }];

      httpClientSpy.delete.and.returnValue(of());
      restServiceSpy.delete.and.returnValue(Promise.resolve());
      heroServiceSpy.delete.and.returnValue(Promise.resolve());
      httpClientSpy.get.and.returnValue(of([]));
      restServiceSpy.get.and.returnValue(Promise.resolve([]));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);

      expect(component.heroes).toEqual([]);
    });

    it('should not delete Hero because of cancelation', async ()  => {
      httpClientSpy.delete.and.returnValue(of());
      restServiceSpy.delete.and.returnValue(Promise.resolve());
      heroServiceSpy.delete.and.returnValue(Promise.resolve());
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: false }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);

      expect(Swal.fire).toHaveBeenCalled();
    });

    it('should not delete Hero because of error', async ()  => {
      const error = new Error('Error al borrar héroe');

      httpClientSpy.delete.and.returnValue(of());
      restServiceSpy.delete.and.returnValue(Promise.reject(error));
      heroServiceSpy.delete.and.returnValue(Promise.reject(error));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);

      expect(component.heroes).toEqual([]);
    });
  });

});
