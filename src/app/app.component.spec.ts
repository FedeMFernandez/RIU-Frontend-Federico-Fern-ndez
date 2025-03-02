import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Location } from '@angular/common';
import { provideRouter, Router, } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
      ],
      providers: [
        provideNoopAnimations(),
        provideRouter(routes),
        { provide: HttpClient, useValue: httpClientSpy },
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should navigate to lazy loaded children', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    router.initialNavigation();
    await router.navigate(['']);
    httpClientSpy.get.and.returnValue(of([]));
    fixture.detectChanges();

    expect(location.path()).toBe('/heroes');
  });
});
