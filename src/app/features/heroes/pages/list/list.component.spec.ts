import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroesListPage } from './list.component';
import { provideRouter } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { By } from '@angular/platform-browser';
import { RestMock } from 'src/app/mocks/rest.mock';
import { HeroService } from '../../services/hero.service';
import { HeroesDataBase, HeroModel } from '../../db/heroes.db';

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

  // it('should navigate to /add route', async () => {
  //   const router = TestBed.inject(Router);
  //   const location = TestBed.inject(Location);

  //   router.initialNavigation();
  //   await router.navigate(['add']);

  //   expect(location.path()).toBe('/add');
  // });

  // it('should navigate to /edit/:id route', async () => {
  //   const expected: HeroModel[] = [{
  //     id: 1,
  //     name: 'FEDE',
  //     power: 'Programación',
  //     weakness: 'Pentium 4',
  //     birth: 682743600,
  //     createdAt: 682743600,
  //   }];
  //   restMockSpy.fakeQuery.and.returnValue(Promise.resolve(expected));
  //   heroServiceSpy.get.and.returnValue(expected);

  //   const router = TestBed.inject(Router);
  //   const location = TestBed.inject(Location);

  //   router.initialNavigation();
  //   await router.navigate(['edit', '1']);

  //   expect(location.path()).toBe('/edit/1');
  // });

  it('should try to search hero with no value', async () => {
    const expected: any = {
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
    };
    let heroDatabase = TestBed.inject(HeroesDataBase);
    heroDatabase.push(expected)
    fixture.detectChanges();

    const inputSearch = fixture.debugElement.query(By.css('input'));
    inputSearch.triggerEventHandler('ngModelChange', '');
    expect(component.dataSource.data).toBeTruthy();
  });

  it('should try to search hero with name', async () => {
    const expected: any = {
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
    };
    let heroDatabase = TestBed.inject(HeroesDataBase);
    heroDatabase.push(expected)
    fixture.detectChanges();

    const inputSearch = fixture.debugElement.query(By.css('input'));
    inputSearch.triggerEventHandler('ngModelChange', 'Fede');
    expect(component.dataSource.data).toBeTruthy();
  });

  it('should try to search hero with id', async () => {
    fixture.detectChanges();
    const expected: any = {
      name: 'FEDE',
      power: 'Programación',
      weakness: 'Pentium 4',
      birth: 682743600,
    };
    let heroDatabase = TestBed.inject(HeroesDataBase);
    heroDatabase.push(expected)
    const inputSearch = fixture.debugElement.query(By.css('input'));
    inputSearch.triggerEventHandler('ngModelChange', '1');
    expect(component.dataSource.data).toBeTruthy();
  });

  describe('deleteEventHandler()', () => {
    it('should delete Hero', async ()  => {
      const expected: any = {
        name: 'FEDE',
        power: 'Programación',
        weakness: 'Pentium 4',
        birth: 682743600,
      };
      let heroDatabase = TestBed.inject(HeroesDataBase);
      heroDatabase.push(expected)
      fixture.detectChanges();
      const spy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);
      expect(spy).toHaveBeenCalled();
    });

    it('should not delete Hero because of error', async ()  => {
      restMockSpy.fakeQuery.and.returnValue(Promise.reject());
      const spy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve(<SweetAlertResult>{ isConfirmed: true }));

      await component.deleteEventHandler({ id: 1, name: 'FEDE' } as any);
      expect(spy).toHaveBeenCalled();
    });
  });

});
