import { LoadingService } from 'src/app/commons/services/loading.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';
import { routes } from './layout.routes';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    loadingService = new LoadingService();

    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter(routes),
        { provide: LoadingService, useValue: loadingService },
        { provide: HttpClient, useValue: httpClientSpy }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-progress-bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    loadingService.loading = true;
    fixture.detectChanges();
    expect(compiled.querySelector('mat-progress-bar')).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
