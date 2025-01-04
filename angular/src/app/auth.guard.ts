import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.services";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";

export const AuthGuardService: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const http = inject(HttpClient);

    if(!authService.getLoggedIn()){
        router.navigateByUrl('/login');
    }else{
        const baseUrl = environment.apiUrl;
        http.get<{username: string}>(`${baseUrl}/users`)
        .subscribe({
            next: (response)=>{
                const username = response.username;
                authService.$currentUser.next(username);
            },
            error: (err)=>{
                console.log(err);
                console.log(err.error.message);
            }
        })
    }
    return true
}