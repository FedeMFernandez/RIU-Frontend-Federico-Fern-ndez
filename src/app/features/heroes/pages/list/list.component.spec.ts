import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroesListPage } from './list.component';
import { provideRouter, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RestMock } from 'src/app/mocks/rest.mock';
import { Location } from '@angular/common';
import { HeroService, HeroModelDTO } from '../../services/hero.service';

describe('HeroesListPage', () => {
  let component: HeroesListPage;
  let fixture: ComponentFixture<HeroesListPage>;
  let restMockSpy: jasmine.SpyObj<RestMock>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;

  beforeEach(async () => {
    restMockSpy = jasmine.createSpyObj('RestMock', ['fakeQuery']);
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['get', 'delete']);

    await TestBed.configureTestingModule({
      imports: [
        HeroesListPage,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([
          { path: 'add', component: {} as any },
          { path: 'edit/:id', component: {} as any }
        ]),
        { provide: RestMock, useValue: restMockSpy },
        { provide: HeroService, useValue: heroServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /add route', async () => {
    restMockSpy.fakeQuery.and.returnValue(Promise.resolve([]));
    heroServiceSpy.get.and.returnValue(Promise.resolve([]));

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.initialNavigation();
    await router.navigate(['add']);

    expect(location.path()).toBe('/add');
  });

  it('should navigate to /edit/:id route', async () => {
    const expected: HeroModelDTO[] = [{
      id: 1,
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
      createdAt: 682743600,
    }];
    restMockSpy.fakeQuery.and.returnValue(Promise.resolve(expected));
    heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.initialNavigation();
    await router.navigate(['edit', '1']);

    expect(location.path()).toBe('/edit/1');
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
    restMockSpy.fakeQuery.and.returnValue(Promise.resolve(expected));
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
    restMockSpy.fakeQuery.and.returnValue(Promise.resolve(expected));
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
      restMockSpy.fakeQuery.and.returnValue(Promise.resolve([]));
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
      restMockSpy.fakeQuery.and.returnValue(Promise.resolve(expected));
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

      await component.ngOnInit();

      expect(component.heroes).toEqual(expected);
    });

    it('should throw response error', async ()  => {
      restMockSpy.fakeQuery.and.returnValue(Promise.reject());
      spyOn(console, 'error').and.callFake(() => {});

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

      restMockSpy.fakeQuery.and.returnValue(Promise.resolve());
      heroServiceSpy.delete.and.returnValue(Promise.resolve());
      restMockSpy.fakeQuery.and.returnValue(Promise.resolve([]));
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);

      expect(component.heroes).toEqual([]);
    });

    it('should not delete Hero because of cancelation', async ()  => {
      restMockSpy.fakeQuery.and.returnValue(Promise.resolve());
      heroServiceSpy.delete.and.returnValue(Promise.resolve());
      const spy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any)
      spy.and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: false }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);

      expect(Swal.fire).toHaveBeenCalled();
    });

    it('should not delete Hero because of error', async ()  => {
      restMockSpy.fakeQuery.and.returnValue(Promise.reject());
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));
      spyOn(console, 'error').and.callFake(() => {});

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);

      expect(component.heroes).toEqual([]);
    });
  });

});
