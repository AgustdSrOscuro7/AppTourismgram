import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { City } from '../interfaces/city.interface';
import { Celebrity } from '../interfaces/celebrity.interface';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Método genérico para realizar solicitudes GET
  get<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers });
  }

  // Método genérico para realizar solicitudes POST
  post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  // Método genérico para realizar solicitudes PUT (actualizar)
  put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  // Método genérico para realizar solicitudes DELETE
  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers });
  }

  // Paises
  getCountries(): Observable<any[]> {
    return this.get<any[]>('Countries');
  }

  // Celebrities
  getCelebrities(): Observable<any[]> {
    return this.get<any[]>('Celebrities');
  }

  getCelebrityById(id: string): Observable<any> {
    return this.get<any>(`Celebrities/${id}`);
  }

  // Cities
  getCities(): Observable<any[]> {
    return this.get<any[]>('Cities');
  }

  // Suponiendo que tienes un endpoint para obtener ciudades por país
  getCitiesByCountryId(countryId: string): Observable<any[]> {
    return this.get<any[]>(`Cities?countryId=${countryId}`); // Ajusta esto según cómo tu API maneje el filtro.
  }

  getSites(): Observable<any[]> { return this.get<any[]>('Sites'); }
  getDishes(): Observable<any[]> { return this.get<any[]>('Dishes'); }
  login(credentials: any): Observable<any> { return this.post<any>('Auth/login', credentials); }
}
