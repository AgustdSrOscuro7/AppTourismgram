// src/app/tab1/tab1.page.ts

import { Component, OnInit } from '@angular/core';
import { ApiService, ApiResponse } from '../services/api.service'; // Importa ApiService y ApiResponse
import {Country, City, Celebrity, Place, Dish} from '../interfaces/data.interface'; // Importa la interfaz Country
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
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
            console.log("Sitios cargados:", this.dishes);
          },
          (error) => {
            console.error('Error al cargar los sitios', error)
          }
        );
        break;
      // Puedes añadir más casos para 'famous', 'sites', 'dishes' aquí
      default:
        break;
    }
  }

  onSegmentChanged(event: any) {
    this.selectedCategory = event.detail.value;
    this.countries = [];
    this.cities = [];
    this.celebrities = [];
    this.loadData();
  }

  logout() {
    this.authService.logout();
  }
}
