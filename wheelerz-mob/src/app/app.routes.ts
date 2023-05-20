import { Routes } from '@angular/router';
import { UserService } from './services/user.service';
import { LoginService } from './services/login.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'stories/road',
    pathMatch: 'full'
  },
  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: 'stories/road'
  },
  {
    path: 'hotel-reviews',
    pathMatch: 'full',
    redirectTo: 'stories/hotel'
  },  
  {
    path: 'stories',
    pathMatch: 'full',
    redirectTo: 'stories/road'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage),
    canActivate: [LoginService]
  },
  {
    path: 'stories/:type',
    loadComponent: () => import('./pages/stories/stories.page').then(m => m.StoriesPage),
    canActivate: [UserService]
  },
  {
    path: 'story-info/:id',
    loadComponent: () => import('./pages/story-view/story-view.component').then(m => m.StoryViewComponent),
    canActivate: [UserService]
  },
  {
    path: 'share/hotel-review',
    loadComponent: () => import('./pages/share/pages/hotel-reviews/hotel-reviews.component').then(m => m.HotelReviewsComponent),
    canActivate: [UserService]
  },
  {
    path: 'share/cities-accessibility',
    loadComponent: () => import('./pages/share/pages/cities-accessibility/cities-accessibility.component').then(c => c.CitiesAccessibilityComponent),
    canActivate: [UserService]
  },
  {
    path: 'share/trends',
    loadComponent: () => import('./pages/share/pages/trends/trends.component').then(c => c.TrendsComponent),
    canActivate: [UserService]
  },
  {
    path: 'share/fellow-travelers',
    loadComponent: () => import('./pages/share/pages/fellow-travelers/fellow-travelers.component').then(c => c.FellowTravelersComponent),
    canActivate: [UserService]
  }
];
