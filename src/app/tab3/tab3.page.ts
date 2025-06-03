// src/app/tab3/tab3.page.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService, ApiResponse } from '../services/api.service';
import { Place } from '../interfaces/data.interface'; // Importa la interfaz Place
import { take } from 'rxjs/operators'; // Para desuscribirse de observables

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {

  favoritePlaces: Place[] = []; // Ahora almacenará objetos Place completos
  loading: boolean = false;
  private localStorageKey: string = 'user_favorites_places'; // Debe coincidir con la clave de Tab1

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Al iniciar, cargamos los datos.
    this.loadFavoritePlaces();
  }

  // Este método se ejecuta cada vez que la pestaña se hace visible
  ionViewWillEnter() {
    this.loadFavoritePlaces();
  }

  loadFavoritePlaces() {
    this.loading = true;
    const favoriteIdsString = localStorage.getItem(this.localStorageKey);
    let storedFavoriteIds: string[] = [];

    if (favoriteIdsString) {
      storedFavoriteIds = JSON.parse(favoriteIdsString);
    }

    // Si no hay IDs guardados en localStorage, no hay favoritos que mostrar
    if (storedFavoriteIds.length === 0) {
      this.favoritePlaces = [];
      this.loading = false;
      return;
    }

    // Si hay IDs en localStorage, cargamos todos los lugares de la API
    // y luego filtramos los que coinciden con los IDs de favoritos.
    this.apiService.getPlaces().pipe(take(1)).subscribe({
      next: (response: ApiResponse<Place[]>) => {
        if (response.Ok && response.resp) {
          const allPlaces = response.resp;
          // Filtra los lugares para mostrar solo los que tienen el ID en localStorage
          this.favoritePlaces = allPlaces.filter(place => storedFavoriteIds.includes(place._id));
          console.log('Lugares favoritos cargados de localStorage (filtrados de la API de Places):', this.favoritePlaces);
        } else {
          console.error('Error al cargar todos los lugares para filtrar favoritos:', response.resp);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en la solicitud para obtener todos los lugares:', err);
        this.loading = false;
        this.favoritePlaces = []; // Asegura que la lista se vacíe en caso de error
      },
    });
  }

  logout(){
    this.authService.logout();
  }

  // Puedes añadir una función para quitar de favoritos desde Tab3 si lo deseas
  removeFavorite(placeId: string) {
    const favoriteIdsString = localStorage.getItem(this.localStorageKey);
    let storedFavoriteIds: string[] = [];

    if (favoriteIdsString) {
      storedFavoriteIds = JSON.parse(favoriteIdsString);
    }

    const updatedFavoriteIds = storedFavoriteIds.filter(id => id !== placeId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedFavoriteIds));
    console.log(`Sitio con ID "${placeId}" eliminado de favoritos (localStorage) desde Tab3.`);

    // Vuelve a cargar la lista para actualizar la UI de Tab3
    this.loadFavoritePlaces();

    // Opcional: Disparar evento de storage para que Tab1 también se actualice si está abierta
    window.dispatchEvent(new StorageEvent('storage', {
      key: this.localStorageKey,
      newValue: JSON.stringify(updatedFavoriteIds),
      oldValue: '',
      url: window.location.href,
      storageArea: localStorage
    }));
  }
}