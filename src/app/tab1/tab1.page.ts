// src/app/tab1/tab1.page.ts

import { Component, OnInit } from '@angular/core';
import { ApiService, ApiResponse } from '../services/api.service';
import { Country, City, Celebrity, Place, Dish } from '../interfaces/data.interface';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// No necesitamos FavoritePlace aquí si no vamos a interactuar con la API de favoritos directamente en este toggle.
// import { FavoritePlace } from '../interfaces/favoritePlace.interface';
// import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  countries: Country[] = [];
  cities: City[] = [];
  celebrities: Celebrity[] = [];
  places: Place[] = [];
  dishes: Dish[] = [];
  selectedCategory: 'countries' | 'cities' | 'famous' | 'sites' | 'dishes' = 'countries';

  // Almacenaremos los IDs de los sitios favoritos en localStorage para una carga rápida.
  private favoritePlaceIds: Set<string> = new Set<string>();
  // Puedes usar un ID de usuario fijo o un ID de sesión si no hay login.
  // Para este ejemplo, usaremos un ID de usuario de ejemplo.
  private localStorageKey: string = 'user_favorites_places'; // Clave genérica para localStorage

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadFavoritesFromLocalStorage(); // Carga favoritos del localStorage al iniciar
    this.loadData();
  }

  // Carga los IDs de favoritos almacenados en localStorage
  loadFavoritesFromLocalStorage() {
    const favoritesString = localStorage.getItem(this.localStorageKey);
    if (favoritesString) {
      const favoritesArray: string[] = JSON.parse(favoritesString);
      this.favoritePlaceIds = new Set<string>(favoritesArray);
    } else {
      this.favoritePlaceIds.clear();
    }
  }

  // Guarda los IDs de favoritos en localStorage
  saveFavoritesToLocalStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(Array.from(this.favoritePlaceIds)));
    // Opcional: Disparar un evento de storage para que otras pestañas (como Tab3) se actualicen inmediatamente.
    // Esto es más avanzado y podría ser innecesario si la "Tab3" se recarga al entrar.
    window.dispatchEvent(new StorageEvent('storage', {
      key: this.localStorageKey,
      newValue: JSON.stringify(Array.from(this.favoritePlaceIds)),
      oldValue: '', // Puedes rellenar esto si lo necesitas
      url: window.location.href,
      storageArea: localStorage
    }));
  }

  // Verifica si un sitio es favorito
  isFavorite(placeId: string): boolean {
    return this.favoritePlaceIds.has(placeId);
  }

  // Alterna el estado de favorito de un sitio
  toggleFavorite(place: Place) {
    const placeId = place._id;

    if (this.isFavorite(placeId)) {
      // Es favorito, hay que quitarlo
      this.favoritePlaceIds.delete(placeId);
      console.log(`Sitio "${place.name}" eliminado de favoritos (localStorage).`);
    } else {
      // No es favorito, hay que añadirlo
      this.favoritePlaceIds.add(placeId);
      console.log(`Sitio "${place.name}" añadido a favoritos (localStorage).`);
    }
    this.saveFavoritesToLocalStorage(); // Guarda el cambio en localStorage
  }

  loadData() {
    switch (this.selectedCategory) {
      case 'countries':
        this.apiService.getCountries().subscribe(
          (response: ApiResponse<Country[]>) => {
            this.countries = response.resp;
            console.log('Países cargados:', this.countries);
          },
          (error) => {
            console.error('Error al cargar países:', error);
          }
        );
        break;
      case 'cities':
        this.apiService.getCities().subscribe(
          (response: ApiResponse<City[]>) => {
            this.cities = response.resp;
            console.log('Ciudades cargadas:', this.cities);
          },
          (error) => {
            console.error('Error al cargar ciudades:', error);
          }
        );
        break;
      case 'famous':
        this.apiService.getCelebrities().subscribe(
          (response: ApiResponse<Celebrity[]>) => {
            this.celebrities = response.resp;
            console.log('Famosos cargados:', this.celebrities);
          },
          (error) => {
            console.error('Error al cargar famosos:', error);
          }
        );
        break;
      case "sites":
        this.apiService.getPlaces().subscribe(
          (response: ApiResponse<Place[]>) => {
            this.places = response.resp;
            console.log("Sitios cargados:", this.places);
          },
          (error) => {
            console.error('Error al cargar los sitios', error)
          }
        );
        break;
      case "dishes":
        this.apiService.getDishes().subscribe(
          (response: ApiResponse<Dish[]>) => {
            this.dishes = response.resp;
            console.log("Platos cargados:", this.dishes);
          },
          (error) => {
            console.error('Error al cargar los platos', error)
          }
        );
        break;
      default:
        break;
    }
  }

  onSegmentChanged(event: any) {
    this.selectedCategory = event.detail.value;
    this.countries = [];
    this.cities = [];
    this.celebrities = [];
    this.places = [];
    this.dishes = [];
    this.loadData();
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}