import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Asegúrate de que esta ruta sea correcta
import { Router } from '@angular/router';

// Opcional: Define una interfaz para las credenciales de usuario y para la respuesta de login/registro
export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegisterData extends UserCredentials {
  // Si tu API de registro requiere más campos, agrégalos aquí
  // Por ejemplo: username?: string;
  role?: string; // Para definir si es Administrador o Usuario Común
}

// Suponiendo que tu API devuelve un objeto con un 'token' y 'user' (o similar) al iniciar sesión
export interface AuthResponse {
  token: string;
  user: any; // Idealmente, tipar esto con una interfaz de User
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Usa la URL de tu entorno
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router // Para redirigir al usuario
  ) {
    // Al iniciar el servicio, verifica si el usuario ya está autenticado (por ejemplo, si hay un token guardado)
    // Por ahora, solo lo marcamos como falso. Más adelante aquí iría la lógica del JWT.
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    // En un futuro, aquí iría la lógica para comprobar si hay un JWT válido.
    // Por ahora, asumimos que no hay nadie logueado al inicio.
    this.isAuthenticatedSubject.next(false);
  }

  // Método para registrar un nuevo usuario
  register(userData: UserRegisterData): Observable<AuthResponse> {
    // Endpoint de registro: Asumo 'Auth/register' o 'Users/register'. ¡Ajusta según tu API!
    return this.http.post<AuthResponse>(`${this.apiUrl}Users`, userData).pipe(
      tap((response) => {
        // Aquí, en el futuro, manejarías el token y la sesión
        console.log('Registro exitoso (sin JWT aún):', response);
        // Si la API devuelve un token al registrarse, podrías manejarlo aquí
        // this.saveToken(response.token);
        // this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error en el registro: ' + error.message || error.statusText || 'Error desconocido'));
      })
    );
  }

  // Método para iniciar sesión
  login(credentials: UserCredentials): Observable<AuthResponse> {
    // Endpoint de login: Asumo 'Auth/login' o 'Users/login'. ¡Ajusta según tu API!
    return this.http.post<AuthResponse>(`${this.apiUrl}Users/login`, credentials).pipe(
      tap((response) => {
        // Aquí, en el futuro, manejarías el token JWT recibido de la API
        console.log('Login exitoso (sin JWT aún):', response);
        // Ejemplo de qué haría la API: Podría devolver { token: '...', user: { ... } }
        // Para fines de prueba y simulación, vamos a "autenticar" al usuario si el login fue exitoso.
        // Más adelante: this.saveToken(response.token);
        this.isAuthenticatedSubject.next(true); // Marca al usuario como autenticado
        this.router.navigateByUrl('/tabs/tab1'); // Redirige a la página principal de tabs
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        this.isAuthenticatedSubject.next(false); // Asegura que el estado sea no autenticado
        return throwError(() => new Error('Error en el registro: ' + error.message || error.statusText || 'Error desconocido'));
      })
    );
  }

  // Método para cerrar sesión (simulado por ahora)
  logout() {
    // En el futuro, aquí eliminarías el JWT del almacenamiento local
    console.log('Cerrando sesión (simulado)');
    this.isAuthenticatedSubject.next(false); // Marca al usuario como no autenticado
    this.router.navigateByUrl('/login'); // Redirige a la página de login
  }

  // Método para obtener el estado de autenticación (observable)
  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated;
  }

  // En el futuro, aquí irían métodos para guardar y obtener el token JWT
  // private saveToken(token: string) { localStorage.setItem('jwt_token', token); }
  // private getToken(): string | null { return localStorage.getItem('jwt_token'); }
  // private removeToken() { localStorage.removeItem('jwt_token'); }
}
