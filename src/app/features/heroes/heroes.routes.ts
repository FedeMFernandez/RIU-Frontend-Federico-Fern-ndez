import { Routes } from '@angular/router';
import { HeroesListPage } from './pages/list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: HeroesListPage,
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/form/form.component').then(m => m.HeroesFormPage),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/form/form.component').then(m => m.HeroesFormPage),
  },
  { path: '**', redirectTo: '' },
];
