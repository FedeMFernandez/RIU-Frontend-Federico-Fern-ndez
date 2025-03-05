import { StorageAdapter } from './../../../../core/adapters/storage.adapter';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesFormPage } from './form.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import moment from 'moment';
import { HeroService, HeroModelDTO } from '../../services/hero.service';
import { Location } from '@angular/common';
import Formats from 'src/app/core/constants/formats.constants';
import { RestMock } from 'src/app/mocks/rest.mock';
import { HeroesErrors } from '../../constants/errors.constants';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { LocalStorageWrapper } from 'src/app/core/wrappers/local-storage.wrapper';

describe('FormComponent', () => {
  let component: HeroesFormPage;
  let fixture: ComponentFixture<HeroesFormPage>;
  let restMockSpy: jasmine.SpyObj<RestMock>;
  let heroServiceSpy: jasmine.SpyObj<HeroService>;
  let storageAdapter: jasmine.SpyObj<StorageAdapter>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    restMockSpy = jasmine.createSpyObj('RestMock', ['fakeQuery']);
    storageAdapter = jasmine.createSpyObj('StorageAdapter', ['get', 'set', 'remove']);
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['get', 'push', 'update', 'delete']);
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
        { provide: LocalStorageWrapper, useValue: storageAdapter },
        { provide: MAT_DATE_FORMATS, useValue: Formats.MOMENT_DATE_FORMAT }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroesFormPage);
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
    heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

    expect(component).toBeTruthy();
  });

  it('should show notification error while fetching heroe', async () => {
    const error = HeroesErrors.HERO_NOT_FOUND(1);
    heroServiceSpy.get.and.returnValue(Promise.reject(error));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);

    await expectAsync(heroServiceSpy.get()).toBeRejectedWith(error);
  });

  describe('submitEventHandler()', () => {
    it('should add hero', async () => {
      activatedRouteMock.snapshot.paramMap = new Map();

      const expected: HeroModelDTO[] = [];
      expected.push({
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      });
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
      restMockSpy.fakeQuery.and.throwError(new Error());
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);

      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: moment.unix(682743600),
      };
      await component.submitEventHandler(formValue);
      expect(restMockSpy.fakeQuery).toHaveBeenCalled();
    });

     it('should update hero', async () => {
      const expected: HeroModelDTO[] = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      }];
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      storageAdapter.get.and.returnValue(expected);
      fixture.detectChanges();

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
      const expected: HeroModelDTO[] = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      }];
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      storageAdapter.get.and.returnValue(expected);
      fixture.detectChanges();

      const error = HeroesErrors.HERO_NOT_FOUND(1);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      storageAdapter.get.and.throwError(error);
      restMockSpy.fakeQuery.and.throwError(error);
      const formValue: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Dual core',
        birth: moment.unix(682743600),
      };
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve() as any);
      await component.submitEventHandler(formValue);
      expect(restMockSpy.fakeQuery).toHaveBeenCalled();
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
      heroServiceSpy.delete.and.returnValue(Promise.resolve());
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler();
      expect(location.path()).toBe('/heroes');
    });

    it('should not delete Hero if its not edition', async ()  => {
      activatedRouteMock.snapshot.paramMap = new Map();
      fixture.detectChanges();

      const expected: HeroModelDTO = {
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      };
      heroServiceSpy.get.and.returnValue(Promise.resolve(expected));

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
      const expected: HeroModelDTO[] = [{
        id: 1,
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
        createdAt: 682743600,
      }];
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      storageAdapter.get.and.returnValue(expected);
      fixture.detectChanges();

      spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));
      const error = HeroesErrors.HERO_NOT_FOUND(1);
      restMockSpy.fakeQuery.and.callFake((callback: Function) => callback());
      storageAdapter.get.and.throwError(error);
      restMockSpy.fakeQuery.and.throwError(error);

      await component.deleteEventHandler();
      expect(restMockSpy.fakeQuery).toHaveBeenCalled();
    });
  });

});
