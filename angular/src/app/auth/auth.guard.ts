import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { AuthService } from "@services/auth.services";
import { environment } from "@environments/environment";

export const AuthGuardService: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const http = inject(HttpClient);

    if(!authService.getLoggedIn()){
        router.navigateByUrl('/home');
    }
    else {
        const baseUrl = environment.apiUrl;
        http.get<{username: string, token: string}>(`${baseUrl}/auth`)
        .subscribe({
            next: (response)=>{
                // Set the full user data in the AuthService
                const user = {
                    username: response.username,
                    token: response.token
                };
                authService.setCurrentUser(user);
            },
            error: (err)=>{
                console.log(err);
                console.log(err.error.message);
            }
        });
    }
    return true;
}