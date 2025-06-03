// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Country, City, Celebrity, Dish, Place } from '../interfaces/data.interface';
import { VisitPlace } from "../interfaces/visits.interface";
import { FavoritePlace } from "../interfaces/favoritePlace.interface"

// Nueva interfaz para la respuesta genérica de tu API
export interface ApiResponse<T> {
  Ok: boolean;
  total: number;
  resp: T; // 'resp' contendrá el array de datos (ej. Country[], City[], etc.)
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { headers });
  }

  post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data, { headers });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { headers });
  }

  getCountries(): Observable<ApiResponse<Country[]>> {
    return this.get<Country[]>('Countries');
  }

  getCities(): Observable<ApiResponse<City[]>> {
    return this.get<City[]>('Cities');
  }
  getCitiesByCountryId(countryId: string): Observable<ApiResponse<City[]>> {
    return this.get<City[]>(`Cities?countryId=${countryId}`);
  }

  getCelebrities(): Observable<ApiResponse<Celebrity[]>> {
    return this.get<Celebrity[]>(`Celebrities`);
  }

  getCelebrityById(id: string): Observable<ApiResponse<Celebrity>> {
    return this.get<Celebrity>(`Celebrities/${id}`);
  }

  getDishes(): Observable<ApiResponse<Dish[]>> { return this.get<Dish[]>('Dishes'); }
  getPlaces(): Observable<ApiResponse<Place[]>> { return this.get<Place[]>('Places'); }
  login(credentials: any): Observable<any> { return this.post<any>('Auth/login', credentials); } // El login puede tener una estructura de respuesta diferente

  getVisitsByUser(userId: string): Observable<ApiResponse<VisitPlace[]>> {
    return this.http.get<ApiResponse<VisitPlace[]>>(`${this.apiUrl}/visitPlaces/user/${userId}`);
  }

  // ¡CORRECCIÓN AQUÍ! Asegúrate de que la URL sea correcta.
  getFavoritesByUser(userId: string): Observable<ApiResponse<FavoritePlace[]>> {
    return this.http.get<ApiResponse<FavoritePlace[]>>(`${this.apiUrl}/Favorites/user/${userId}`);
  }

  addFavorite(userId: string, siteId: string): Observable<ApiResponse<FavoritePlace>> {
    return this.http.post<ApiResponse<FavoritePlace>>(`${this.apiUrl}/Favorites`, { user_id: userId, site_id: siteId });
  }

  removeFavorite(favoriteId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Favorites/${favoriteId}`);
  }

  removeFavoriteByUserIdAndSiteId(userId: string, siteId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Favorites/byUserAndSite?user_id=${userId}&site_id=${siteId}`);
  }
}