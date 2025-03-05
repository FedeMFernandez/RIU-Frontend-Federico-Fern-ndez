import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingSignal } from '../core/signals/loading.signal';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let loadingSignal: LoadingSignal;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter([]),
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    loadingSignal = TestBed.inject(LoadingSignal);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-progress-bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    loadingSignal.loading = true;
    fixture.detectChanges();
    expect(compiled.querySelector('mat-progress-bar')).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
