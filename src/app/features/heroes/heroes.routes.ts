import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/list/list.component').then(m => m.ListComponent),
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/form/form.component').then(m => m.FormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/form/form.component').then(m => m.FormComponent),
  },
  { path: '**', redirectTo: '' },
];
