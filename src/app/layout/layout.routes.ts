import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'heroes',
        loadChildren: () => import('../features/heroes/heroes.routes').then(m => m.routes),
      },
      { path: '**', redirectTo: 'heroes' },
    ],
  },
];
