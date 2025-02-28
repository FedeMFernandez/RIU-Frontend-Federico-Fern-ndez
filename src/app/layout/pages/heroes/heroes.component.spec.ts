import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesComponent } from './heroes.component';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from 'src/app/commons/services/hero.service';
import { RestService } from 'src/app/commons/services/rest.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';


describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  let restServiceSpy: jasmine.SpyObj<RestService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let heroService: HeroService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    restServiceSpy = jasmine.createSpyObj('RestService', ['get']);
    heroService = jasmine.createSpyObj('HeroService', ['get']);

  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroesComponent,
      ],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

