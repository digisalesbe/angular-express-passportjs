import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

import { AuthService } from "@services/auth.services";

// export class AuthInterceptor implements HttpInterceptor{

//     constructor(private router: Router, private authService: AuthService){}

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        
//         return next.handle(req);
//     }
// }

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) =>{
    const router = inject(Router);
    const authService = inject(AuthService);

    const token = authService.getToken();
    if (token === null || token === undefined) {
        const currentUrl = router.routerState.snapshot.url;
        if(['/login', '/register'].includes(currentUrl)){
            router.navigateByUrl(currentUrl);
        }else{
            router.navigateByUrl('/login');
        }
    } else {
       req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req);
}