import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Celebrity } from '../../../interfaces/data.interface';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-celebrity-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card *ngIf="celebrity">
      <ion-card-header>
        <ion-card-title>{{ celebrity.name }}</ion-card-title>
        <ion-card-subtitle>{{ celebrity.profession }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <p>Imagen: {{ celebrity.img }}</p>
        <p>Biografía: {{ celebrity.city_id }}</p>
      </ion-card-content>
    </ion-card>
  `,
  styles: [``]
})
export class CelebrityCardComponent {
  @Input() celebrity!: Celebrity;
}
