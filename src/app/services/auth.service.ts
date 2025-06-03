import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Asegúrate de que esta ruta sea correcta
import { Router } from '@angular/router';

// Opcional: Define una interfaz para las credenciales de usuario y para la respuesta de login/registro
export interface UserCredentials {
  mail: string;
  password: string;
}

export interface UserRegisterData extends UserCredentials {
  name: string;
  rol: string;
}

export interface User {
  _id: string;
  name: string;
  mail: string;
  rol: string;
  state: string;
  date_creation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_DATA_KEY = 'user_data';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  // --- MÉTODOS DE MANEJO DEL TOKEN ---
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // --- MÉTODOS PARA DATOS DEL USUARIO ---

  private saveUserData(user: User): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
  }

  private getUserData(): User | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private removeUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const userData = this.getUserData();

    // Si hay token y datos de usuario, consideramos autenticado
    const isLoggedIn = !!token && !!userData;
    this.isAuthenticatedSubject.next(isLoggedIn);
    this.currentUserSubject.next(userData); // Publica los datos del usuario

    // Si ya está autenticado al cargar la app y no está en login/register, redirigir a tabs
    if (isLoggedIn && !this.router.url.includes('/login') && !this.router.url.includes('/register')) {
      this.router.navigateByUrl('/tabs/tab1');
    }
  }

  // Método para registrar un nuevo usuario
  register(userData: UserRegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Users`, userData).pipe(
      tap((response) => {
        console.log('Registro exitoso:', response);
      }),
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error en el registro: ' + (error.error?.msg || error.statusText || 'Error desconocido')));
      })
    );
  }

  // Método para iniciar sesión
  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Auth/login`, credentials).pipe(
      tap((response) => {
        console.log('Login exitoso:', response);
        if (response.token && response.user) { // Asegúrate de que la API devuelva 'user' también
          this.saveToken(response.token);
          this.saveUserData(response.user); // <-- ¡Guardamos los datos del usuario!
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.user); // Publica los datos del usuario
          this.router.navigateByUrl('/tabs/explore');
        } else {
          console.warn('Login exitoso pero no se recibió token o datos de usuario.');
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null); // Asegura que no hay datos de usuario
        }
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null); // Limpia los datos del usuario en caso de error
        return throwError(() => new Error('Error en el login: ' + (error.error?.msg || error.statusText || 'Error desconocido del servidor')));
      })
    );
  }

  // Método para cerrar sesión
  logout() {
    console.log('Cerrando sesión');
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigateByUrl('/login');
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated;
  }
}
