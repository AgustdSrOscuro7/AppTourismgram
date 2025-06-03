import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators'; // Importa map y take

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getAuthStatus().pipe(
      take(1), // Asegura que solo tomamos el primer valor y completamos el observable
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // Permite el acceso si está autenticado
        } else {
          // Si no está autenticado, redirige al login
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
