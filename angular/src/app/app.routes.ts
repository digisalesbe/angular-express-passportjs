import { Routes } from '@angular/router';

import { AuthGuardService } from '@auth/auth.guard';

import { HomeComponent } from '@home/home.component';
import { PageNotFoundComponent } from '@core/components/pagenotfound/pagenotfound.component';

import { LoginComponent } from '@auth/login/login.component';
import { RegisterComponent } from '@auth/register/register.component';
import { AccountConfirmationComponent } from '@auth/account-confirmation/account-confirmation.component';

import { AboutComponent } from './about/about.component';
import { DashboardComponent } from '@members/dashboard/dashboard.component';
import { ProfileComponent } from '@members/profile/profile.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: LoginComponent },
    { path: 'about', component: AboutComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
    { path: 'confirm/:token', component: AccountConfirmationComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

