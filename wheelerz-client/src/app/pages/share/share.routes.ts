import { Routes } from '@angular/router';

export const SHARE_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'story'
    },
    {
        path: 'story',
        loadComponent: () => import('./pages/stories/stories.component').then(c => c.StoriesComponent)
    },
    {
        path: 'hotel-review',
        loadComponent: () => import('./pages/hotel-reviews/hotel-reviews.component').then(c => c.HotelReviewsComponent)
    },
    {
        path: 'cities-accessibility',
        loadComponent: () => import('./pages/cities-accessibility/cities-accessibility.component').then(c => c.CitiesAccessibilityComponent)
    },
    {
        path: 'trends',
        loadComponent: () => import('./pages/trends/trends.component').then(c => c.TrendsComponent)
    },
    {
        path: 'fellow-travelers',
        loadComponent: () => import('./pages/fellow-travelers/fellow-travelers.component').then(c => c.FellowTravelersComponent)
    }
];