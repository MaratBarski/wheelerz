import { Routes } from '@angular/router'

export const MY_PROFILE_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general'
    },
    {
        path: 'general',
        loadComponent: () => import('./general-info/general-info.component').then(c => c.GeneralInfoComponent)
    },
    {
        path: 'accessibility',
        loadComponent: () => import('./my-accessibility/my-accessibility.component').then(c => c.MyAccessibilityComponent)
    }
];