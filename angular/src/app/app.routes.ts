import { Routes } from '@angular/router';

import { HomeComponent } from '@home/home.component';
import { PageNotFoundComponent } from '@core/components/pagenotfound/pagenotfound.component';
import { LoginComponent } from '@auth/login/login.component';
import { RegisterComponent } from '@auth/register/register.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from '@members/dashboard/dashboard.component';
import { ProfileComponent } from '@members/profile/profile.component';

import { AuthGuardService } from '@auth/auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

