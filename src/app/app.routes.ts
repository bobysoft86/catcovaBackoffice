import { Routes } from '@angular/router';
import { Layout } from './layout/layout/layout';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users-list/users-list')
            .then(m => m.UsersListPage)
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./pages/articles/articles-listpage/articles-listpage')
            .then(m => m.ArticlesListpage)
      },

      {
        path: 'rentals',
        loadComponent: () =>
          import('./pages/rentals/rental-list-page/rental-list-page')
            .then(m => m.RentalListPage)
      },

    ]
  }, {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page').then(m => m.LoginPage),
  },

  { path: '**', redirectTo: 'login' },

];