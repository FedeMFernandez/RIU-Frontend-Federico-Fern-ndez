import { Routes } from '@angular/router';
import { ListComponent } from './pages/list/list.component';

export const routes: Routes = [
  {
    path: '',
    component: ListComponent,
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
