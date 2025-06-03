import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Dish } from '../../../interfaces/data.interface';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dish-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card *ngIf="dish">
      <img [src]="dish.img" *ngIf="dish.img" alt="Imagen del plato">
      <ion-card-header>
        <ion-card-title>{{ dish.name }}</ion-card-title>
        <ion-card-subtitle>{{ cityName }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <p>{{ dish.description }}</p>
      </ion-card-content>
    </ion-card>
  `,
  styles: [``]
})
export class DishCardComponent implements OnInit {
  @Input() dish!: Dish;
  cityName: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCities().subscribe(cities => {
      let city: any;
      city = cities.find(c => c.id === this.dish.city_id);
      this.cityName = city ? city.name : 'Ciudad desconocida';
    });
  }
}
