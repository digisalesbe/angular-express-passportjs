import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './home/pagenotfound.component';
import { AuthGuardService } from './auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

