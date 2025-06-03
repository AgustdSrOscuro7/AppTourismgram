import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators'; // Necesitamos take y map de rxjs/operators

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getAuthStatus().pipe(
      take(1), // Toma el primer valor y luego completa
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // El usuario está autenticado, permite el acceso
        } else {
          // El usuario no está autenticado, redirige al login
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
