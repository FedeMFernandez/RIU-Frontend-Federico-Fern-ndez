import { Routes } from '@angular/router';
import { HeroesComponent } from './heroes.component';
import { FormComponent as FormComponent } from './form/form.component';

export const routes: Routes = [
  {
    path: '',
    component: HeroesComponent,
  },
  {
    path: 'add',
    component: FormComponent,
  },
  {
    path: 'edit/:id',
    component: FormComponent,
  },
];
