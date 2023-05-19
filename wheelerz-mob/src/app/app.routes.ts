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
];
