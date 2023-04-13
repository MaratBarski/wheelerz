import { Routes } from '@angular/router'
import { SHARE_ROUTES } from './pages/share/share.routes'
import { UserService } from './services/user.service'
import { LoginService } from './services/login.service';
import { MY_PROFILE_ROUTES } from './pages/my-profile/myProfile.routes';

export const APP_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'stories'
    },
    // {
    //     path: 'home',
    //     loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
    //     canActivate: [UserService]
    // },
    {
        path: 'home',
        pathMatch: 'full',
        redirectTo: 'stories'
    },
    {
        path: 'stories',
        loadComponent: () => import('./pages/stories/stories.component').then(c => c.StoriesComponent),
        canActivate: [UserService]
    },
    {
        path: 'story-info/:id',
        loadComponent: () => import('./pages/story-view/story-view.component').then(c => c.StoryViewComponent),
        canActivate: [UserService]
    },
    {
        path: 'hotel-reviews',
        loadComponent: () => import('./pages/hotel-reviews/hotel-reviews.component').then(c => c.HotelReviewsComponent),
        canActivate: [UserService]
    },
    {
        path: 'cities-accessibility',
        loadComponent: () => import('./pages/cities-accessibility/cities-accessibility.component').then(c => c.CitiesAccessibilityComponent),
        canActivate: [UserService]
    },
    {
        path: 'trends',
        loadComponent: () => import('./pages/trends/trends.component').then(c => c.TrendsComponent),
        canActivate: [UserService]
    },
    {
        path: 'fellow-travelers',
        loadComponent: () => import('./pages/fellow-travelers/fellow-travelers.component').then(c => c.FellowTravelersComponent),
        canActivate: [UserService]
    },
    {
        path: 'share',
        loadComponent: () => import('./pages/share/share.component').then(c => c.ShareComponent),
        canActivate: [UserService],
        children: SHARE_ROUTES
    },
    {
        path: 'my-profile',
        loadComponent: () => import('./pages/my-profile/my-profile.component').then(c => c.MyProfileComponent),
        canActivate: [UserService],
        children: MY_PROFILE_ROUTES
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
        canActivate: [LoginService]
    },
    {
        path: 'registration',
        loadComponent: () => import('./pages/registration/registration.component').then(c => c.RegistrationComponent),
        canActivate: [LoginService]
    }
];