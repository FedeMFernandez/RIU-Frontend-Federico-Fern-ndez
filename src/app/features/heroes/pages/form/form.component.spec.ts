import { StorageAdapter } from './../../../../core/adapters/storage.adapter';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HeroesFormPage } from './form.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import moment from 'moment';
import { HeroService } from '../../services/hero.service';
import { Location } from '@angular/common';
import Formats from 'src/app/core/constants/formats.constants';
import { RestMock } from 'src/app/mocks/rest.mock';
import { HeroesErrors } from '../../constants/errors.constants';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LocalStorageWrapper } from 'src/app/core/wrappers/local-storage.wrapper';
import { HeroesDataBase, HeroModel } from '../../db/heroes.db';

describe('HeroesFormPage', () => {
  let component: HeroesFormPage;
  let fixture: ComponentFixture<HeroesFormPage>;
  let restMockSpy: jasmine.SpyObj<RestMock>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;
  let localStorageWrapperSpy: jasmine.SpyObj<LocalStorageWrapper>;
  let heroesDataBaseSpy: jasmine.SpyObj<HeroesDataBase>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    restMockSpy = jasmine.createSpyObj('RestMock', ['fakeQuery']);
    localStorageWrapperSpy = jasmine.createSpyObj('LocalStorageWrapper', ['get', 'set', 'remove']);
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['get', 'push', 'update', 'delete']);
    heroesDataBaseSpy = jasmine.createSpyObj('HeroesDataBase', ['get', 'push', 'update', 'delete']);
    activatedRouteMock = {
      snapshot: {
        paramMap: new Map([['id', '1']]),
      }
    };

    await TestBed.configureTestingModule({
      imports: [HeroesFormPage],
      providers: [
        provideRouter([{
          path: 'heroes', component: {} as any,
        }]),
        provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: RestMock, useValue: restMockSpy },
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: LocalStorageWrapper, useValue: localStorageWrapperSpy },
        { provide: HeroesDataBase, useValue: heroesDataBaseSpy },
        { provide: MAT_DATE_FORMATS, useValue: Formats.MOMENT_DATE_FORMAT }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroesFormPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const expected: HeroModel = <HeroModel>{
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
      createdAt: 682743600,
    };
    heroServiceSpy.get.and.returnValue(expected);
    spyOn(Swal, 'fire');
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show notification error while fetching heroe', async () => {
      const expected: HeroModel = <HeroModel>{
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
      createdAt: 682743600,
    };
    heroServiceSpy.get.and.returnValue(expected);
    const spy = spyOn(Swal, 'fire');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  describe('submitEventHandler()', () => {
    it('should add hero', async () => {
      activatedRouteMock.snapshot.paramMap = new Map();

      const expected: HeroModel[] = [];
      expected.push({
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      });
      heroServiceSpy.push.and.returnValue(expected[0]);
      spyOn(Swal, 'fire');

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);

      expect(heroServiceSpy.update).not.toHaveBeenCalled();
    });

    it('should not add hero', async () => {
      const spy = spyOn(Swal, 'fire');
      const error = new Error('fake error')
      heroServiceSpy.push.and.throwError(error)
      heroesDataBaseSpy.push.and.throwError(error)
      localStorageWrapperSpy.set.and.callThrough();

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);
      expect(spy).toHaveBeenCalled();
    });

     it('should update hero', async () => {
      const expected: HeroModel = <HeroModel>{
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      heroServiceSpy.get.and.returnValue(expected);
      const spy = spyOn(Swal, 'fire');
      fixture.detectChanges();

      heroServiceSpy.update.and.returnValue(Promise.resolve(expected));
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      heroesDataBaseSpy.update.and.callFake(() => expected)
      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Dual core',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);
      expect(spy).toHaveBeenCalled();
    });

    it('should not update hero', fakeAsync(async () => {
      const expected: HeroModel = <HeroModel>{
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      heroServiceSpy.get.and.returnValue(expected);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      heroesDataBaseSpy.get.and.returnValue(expected);
      localStorageWrapperSpy.get.and.returnValue(expected);
      const spy = spyOn(Swal, 'fire');
      fixture.detectChanges();

      const error = new Error('fake error')
      heroServiceSpy.update.and.throwError(error)
      restMockSpy.fakeQuery.and.rejectWith(error);
      heroesDataBaseSpy.get.and.throwError(error)
      localStorageWrapperSpy.set.and.callThrough();
      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Dual core',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);

      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('deleteEventHandler()', () => {
    it('should delete Hero', async ()  => {
      const expected: HeroModel = <HeroModel>{
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      heroServiceSpy.get.and.returnValue(expected);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      heroesDataBaseSpy.get.and.returnValue(expected);
      localStorageWrapperSpy.get.and.returnValue(expected);
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));
      fixture.detectChanges();

      const location = TestBed.inject(Location);
      heroServiceSpy.delete.and.returnValue(Promise.resolve());

      await component.deleteEventHandler();
      expect(location.path()).toBe('/heroes');
    });

    it('should not delete Hero if its not edition', async ()  => {
      const expected: HeroModel = <HeroModel>{
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      heroServiceSpy.get.and.returnValue(expected);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      heroesDataBaseSpy.get.and.returnValue(expected);
      localStorageWrapperSpy.get.and.returnValue(expected);

      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));
      activatedRouteMock.snapshot.paramMap = new Map();
      fixture.detectChanges();

      await component.deleteEventHandler();
      expect(heroServiceSpy.get).not.toHaveBeenCalled();
    });

    it('should not delete Hero because of cancelation', async ()  => {
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: false }));
      fixture.detectChanges();

      await component.deleteEventHandler();
      expect(Swal.fire).toHaveBeenCalled();
    });

    it('should not delete Hero because of error', async ()  => {
      const expected: HeroModel = <HeroModel>{
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      heroServiceSpy.get.and.returnValue(expected);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      heroesDataBaseSpy.get.and.returnValue(expected);
      localStorageWrapperSpy.get.and.returnValue(expected);
      fixture.detectChanges();

      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));
      const error = HeroesErrors.HERO_NOT_FOUND(1);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      localStorageWrapperSpy.get.and.throwError(error);
      restMockSpy.fakeQuery.and.throwError(error);

      await component.deleteEventHandler();
      expect(restMockSpy.fakeQuery).toHaveBeenCalled();
    });
  });

});
